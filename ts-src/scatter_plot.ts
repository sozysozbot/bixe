type Point = { x: number; y: number };
export function generateLogLogScatterPlotAndLinesSVG(
    points: Point[],
    lines: Point[][] = []
): string {
    // Return an empty SVG if there is no data.
    if (points.length === 0) {
        return `<svg xmlns="http://www.w3.org/2000/svg"></svg>`;
    }

    // Ensure all data points are positive (required for log scale).
    for (const d of points) {
        if (d.x <= 0 || d.y <= 0) {
            throw new Error("All data values must be positive for a log-log plot.");
        }
    }

    // Define overall SVG dimensions and margins for axes and labels.
    const width = 800;
    const height = 600;
    const margin = { top: 50, right: 50, bottom: 50, left: 60 };

    // Extract x and y values.
    const xs = points.map((d) => d.x);
    const ys = points.map((d) => d.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    // Compute logarithms (base 10) of the min and max values.
    const logMinX = Math.log10(minX);
    const logMaxX = Math.log10(maxX);
    const logMinY = Math.log10(minY);
    const logMaxY = Math.log10(maxY);

    // Compute the drawable width and height.
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    // Transformation functions: data (log space) -> SVG pixel coordinates.
    const xScale = (x: number): number => {
        const logX = Math.log10(x);
        return margin.left + ((logX - logMinX) / (logMaxX - logMinX)) * plotWidth * 0.8;
    };

    const yScale = (y: number): number => {
        const logY = Math.log10(y);
        // In SVG, y=0 is at the top so we invert the coordinate.
        return margin.top + plotHeight - ((logY - logMinY) / (logMaxY - logMinY)) * plotHeight * 0.8;
    };

    // Create tick marks at integer powers of 10 for the x-axis.
    const xTicks: { value: number; x: number }[] = [];
    const xTickStart = Math.floor(logMinX);
    const xTickEnd = Math.ceil(logMaxX);
    for (let i = xTickStart; i <= xTickEnd; i++) {
        const tickValue = Math.pow(10, i);
        const xPos = xScale(tickValue);
        xTicks.push({ value: tickValue, x: xPos });
    }

    // Create tick marks for the y-axis.
    const yTicks: { value: number; y: number }[] = [];
    const yTickStart = Math.floor(logMinY);
    const yTickEnd = Math.ceil(logMaxY);
    for (let i = yTickStart; i <= yTickEnd; i++) {
        const tickValue = Math.pow(10, i);
        const yPos = yScale(tickValue);
        yTicks.push({ value: tickValue, y: yPos });
    }

    // Begin building the SVG string.
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`;
    // Optional: Add a white background.
    svgContent += `<rect width="100%" height="100%" fill="white" />`;

    // Draw vertical grid lines for each x-axis tick.
    for (const tick of xTicks) {
        svgContent += `<line x1="${tick.x}" y1="${margin.top}" x2="${tick.x}" y2="${margin.top + plotHeight}" stroke="#ddd" />`;
    }

    // Draw horizontal grid lines for each y-axis tick.
    for (const tick of yTicks) {
        svgContent += `<line x1="${margin.left}" y1="${tick.y}" x2="${margin.left + plotWidth}" y2="${tick.y}" stroke="#ddd" />`;
    }

    // Draw the x-axis (horizontal line) at the bottom of the plot area.
    svgContent += `<line x1="${margin.left}" y1="${margin.top + plotHeight}" x2="${margin.left + plotWidth}" y2="${margin.top + plotHeight}" stroke="black" />`;
    // Draw the y-axis (vertical line) on the left of the plot area.
    svgContent += `<line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotHeight}" stroke="black" />`;

    // Draw x-axis tick marks and their labels.
    for (const tick of xTicks) {
        // Tick mark.
        svgContent += `<line x1="${tick.x}" y1="${margin.top + plotHeight}" x2="${tick.x}" y2="${margin.top + plotHeight + 5}" stroke="black" />`;
        // Label (using exponent notation, e.g. 10^2).
        const exponent = Math.round(Math.log10(tick.value));
        const label = `10^${exponent}`;
        svgContent += `<text x="${tick.x}" y="${margin.top + plotHeight + 20}" font-size="10" text-anchor="middle">${label}</text>`;
    }

    // Draw y-axis tick marks and their labels.
    for (const tick of yTicks) {
        // Tick mark.
        svgContent += `<line x1="${margin.left - 5}" y1="${tick.y}" x2="${margin.left}" y2="${tick.y}" stroke="black" />`;
        // Label.
        const exponent = Math.round(Math.log10(tick.value));
        const label = `10^${exponent}`;
        svgContent += `<text x="${margin.left - 7}" y="${tick.y + 3}" font-size="10" text-anchor="end">${label}</text>`;
    }

    // Plot each data point as a blue circle.
    for (const d of points) {
        const cx = xScale(d.x);
        const cy = yScale(d.y);
        svgContent += `<circle cx="${cx}" cy="${cy}" r="10" fill="#4285F4" />`;
    }

    // Plot each line as a path.
    for (const line of lines) {
        if (line.length > 1) {
            let path = `M ${xScale(line[0].x)} ${yScale(line[0].y)}`;
            for (let i = 1; i < line.length; i++) {
                path += ` L ${xScale(line[i].x)} ${yScale(line[i].y)}`;
            }
            svgContent += `<path d="${path}" fill="none" stroke="red" stroke-width="4" />`;
        }
    }

    // Close the SVG tag.
    svgContent += `</svg>`;

    return svgContent;
}
