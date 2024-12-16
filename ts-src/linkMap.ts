/* AUTOMATICALLY GENERATED. DO NOT EDIT MANUALLY */
type Source = "筆兵無傾AdC広報処コメント2024" | "抜粋版辞書集前文" | "ゲムマ2024秋広報処コメント" | "LAUZAIT-CEPルールブック" | "ゲムマ2024春広報処コメント" | "【耳声手片】説明書" | "かるたスライド" | "プロパガンダかるた" | "筆兵無傾バランスゲームのカード" | "製造業者紹介チラシ" | "discord会話" | "フォントテスト用パングラム" | "筆兵無傾AdC広報処コメント" | "2023年5月ゲムマ収録漏れ資料" | "我々の遊戯" | "パングラム2" | "【羅古論】目録" | "PMCF ポスター" | "机戦紹介スライド" | "連盟サイト「遊戯の道具」" | "連盟サイト「駒・役と点数」" | "机戦戦術研究テキスト" | "レヴェン・法・タムツイ" | "我々の文化オープニング" | "我々の文化3机戦の歴史" | "2021年始ご挨拶" | "机戦指し始め" | "紙机戦の書" | "諸机戦" | "踏越え論" | "異世界に転生したけど日本語が通じなかった" | "連盟員速習" | "国際母語の日" | "アイル統一机戦書" | "アイル統一机戦書記譜例" | "国際共産歌詞" | "冠光歌詞" | "改良版アリス" | "東島通商語入門" | "パングラム" | "地震速報" | "不信心者" | "クレオール言語に関する一考察" | "あいさつ" | "PMCFショーケース";
const sources_new_to_old: string[] = ["筆兵無傾AdC広報処コメント2024","抜粋版辞書集前文","ゲムマ2024秋広報処コメント","LAUZAIT-CEPルールブック","ゲムマ2024春広報処コメント","【耳声手片】説明書","かるたスライド","プロパガンダかるた","筆兵無傾バランスゲームのカード","製造業者紹介チラシ","discord会話","フォントテスト用パングラム","筆兵無傾AdC広報処コメント","2023年5月ゲムマ収録漏れ資料","我々の遊戯","パングラム2","【羅古論】目録","PMCF ポスター","机戦紹介スライド","連盟サイト「遊戯の道具」","連盟サイト「駒・役と点数」","机戦戦術研究テキスト","レヴェン・法・タムツイ","我々の文化オープニング","我々の文化3机戦の歴史","2021年始ご挨拶","机戦指し始め","紙机戦の書","諸机戦","踏越え論","異世界に転生したけど日本語が通じなかった","連盟員速習","国際母語の日","アイル統一机戦書","アイル統一机戦書記譜例","国際共産歌詞","冠光歌詞","改良版アリス","東島通商語入門","パングラム","地震速報","不信心者","クレオール言語に関する一考察","あいさつ","PMCFショーケース"];
const is_valid_source = (source: string): source is Source => {
  return sources_new_to_old.includes(source);
}

type Hyperlinks = {
  [key in Source]: string[]
};

const HYPERLINKS: Hyperlinks = {
  "筆兵無傾AdC広報処コメント2024": [
    "https://ail-mo-leti-cep.github.io/blog/advent-calendar-20241201/",
    "https://docs.google.com/document/d/1vyZu2sNI3FxL37aal3auE7uI7W8rC8T2Ulf8VcQXsYU/edit?tab=t.0"
  ],
  "抜粋版辞書集前文": [
    "https://docs.google.com/document/d/1hul76y3_dCx65-mGHCVxdKD82_fh1Z2xiGp-bykFhjE/edit?tab=t.0"
  ],
  "ゲムマ2024秋広報処コメント": [
    "https://ail-mo-leti-cep.github.io/blog/game-market-2024-autumn/",
    "https://docs.google.com/document/d/1NEPYHxtvZIIO2uO2OqyghQCP_nZW5oPtmMFz6WsMmD0/edit?tab=t.0"
  ],
  "LAUZAIT-CEPルールブック": [
    "https://github.com/yasusho/lanerme_traditional_games/blob/master/lauzait_cep/pemecepe.tsv",
    "https://github.com/yasusho/lanerme_traditional_games/tree/master/lauzait_cep/original_for_print"
  ],
  "ゲムマ2024春広報処コメント": [
    "https://ail-mo-leti-cep.github.io/blog/game-market-2024-spring/"
  ],
  "【耳声手片】説明書": [
    "https://docs.google.com/document/d/1VZn9sYYkipnsxbx5amXoHb-2_SJK8OpfNzYDZ5KtSgM/edit?tab=t.0"
  ],
  "かるたスライド": [
    "https://github.com/yasusho/lanerme_traditional_games/blob/master/%E3%82%B2%E3%83%A0%E3%83%9E2024%E6%98%A5/%E3%81%8B%E3%82%8B%E3%81%9F/%E3%82%B9%E3%83%A9%E3%82%A4%E3%83%89.pdf"
  ],
  "プロパガンダかるた": [
    "https://docs.google.com/spreadsheets/d/1JzhVzijdhzNW8TLLFvWkjnX-BeEaOKHWZtaKBy31U3c"
  ],
  "筆兵無傾バランスゲームのカード": [
    "https://docs.google.com/document/d/1JznNFsBIh3aFR-ULijNYpbe22uYy__iXK08CiluEtlA/edit"
  ],
  "製造業者紹介チラシ": [
    "https://github.com/yasusho/lanerme_traditional_games/blob/master/%E3%82%B2%E3%83%A0%E3%83%9E2023%E7%A7%8B/%E8%A3%BD%E9%80%A0%E6%A5%AD%E8%80%85%E7%B4%B9%E4%BB%8B%E3%83%81%E3%83%A9%E3%82%B7.pdf"
  ],
  "discord会話": [
    "(private)"
  ],
  "フォントテスト用パングラム": [
    "https://docs.google.com/spreadsheets/d/1GBBZcf6Ym84P8c4GfzgbqDDqE0jS8839S5zWdxLph2w/edit#gid=351330495"
  ],
  "筆兵無傾AdC広報処コメント": [
    "https://docs.google.com/document/d/18MZKAB2-2_0_p5npWBpjplr-tzXIiMjEz0WvNqd0t4w/edit",
    "https://ail-mo-leti-cep.github.io/blog/advent-calendar-20231201/"
  ],
  "2023年5月ゲムマ収録漏れ資料": [
    "https://docs.google.com/document/d/1Izia_aEB_UPlU0iy5pSY5yLOnnVuDFxk6BfEKRAgWr0/edit"
  ],
  "我々の遊戯": [
    "https://docs.google.com/document/d/1kuVKX8Hb13o2nLRk9wtARFzvvMThSG2NG-9mJravPX0/edit",
    "https://github.com/yasusho/lanerme_traditional_games/blob/cdfd0d02e634d57d207d3f5bf94c321f359aef60/%E3%82%B2%E3%83%A0%E3%83%9E2023/%E6%88%91%E3%80%85%E3%81%AE%E9%81%8A%E6%88%AF.pdf"
  ],
  "パングラム2": [
    "https://docs.google.com/spreadsheets/d/1GBBZcf6Ym84P8c4GfzgbqDDqE0jS8839S5zWdxLph2w/edit#gid=351330495"
  ],
  "【羅古論】目録": [
    "https://docs.google.com/spreadsheets/d/17XrP_o4iL5ZL1g_4_DU2pctU74u0vFjFVk2k1TymgPk/edit#gid=2039821671",
    "https://ail-mo-leti-cep.github.io/abelip/laneme-penulleti-lukup-lukup/"
  ],
  "PMCF ポスター": [
    "https://docs.google.com/document/d/1ud7LNFPlTaNmKTz4xuKWV6kkDr8Fh7I-M-XqbG5He7Y/edit"
  ],
  "机戦紹介スライド": [
    "https://drive.google.com/file/d/1AoAnuhjE5aJbI1cFgowHI5k0xjD8T959/view"
  ],
  "連盟サイト「遊戯の道具」": [
    "https://docs.google.com/document/d/1I9Ep-FxrNWchSLOYHzRSvPPsAHAau9VuVbH49XtRYns/edit"
  ],
  "連盟サイト「駒・役と点数」": [
    "https://docs.google.com/document/d/1I9Ep-FxrNWchSLOYHzRSvPPsAHAau9VuVbH49XtRYns/edit"
  ],
  "机戦戦術研究テキスト": [
    "https://docs.google.com/document/d/1KlxwGoCa7Z8qiK6suM8LWAU5mmyyj56iLEx1-317rJA/edit"
  ],
  "レヴェン・法・タムツイ": [
    "https://docs.google.com/document/d/1ie9sMquQv5jxEIxadUwSWwGptqoCDouxvolonZidNjs"
  ],
  "我々の文化オープニング": [
    "https://docs.google.com/document/d/1Qt7wpnstYOKuMzeHr3IfVscsL5x0LNLiiacUijZLdzQ/edit"
  ],
  "我々の文化3机戦の歴史": [
    "https://docs.google.com/document/d/1Qt7wpnstYOKuMzeHr3IfVscsL5x0LNLiiacUijZLdzQ/edit"
  ],
  "2021年始ご挨拶": [
    "https://www.nicovideo.jp/watch/sm38096184",
    "https://docs.google.com/document/d/1ZcVQjcy1UMMd_gGWELue9Dc-Z-NAW6AaXsmRlMrccAo/edit#heading=h.jtf361c4lkqs"
  ],
  "机戦指し始め": [
    "https://docs.google.com/document/d/1Pkrg2TWlQHQSjHtvpnM4UmBrCi-BX-Gw-Lk1cVkEbk8/edit"
  ],
  "紙机戦の書": [
    "https://docs.google.com/document/d/19UneGwgfiFGePejBb_sf2aFGZbLWmlyL_euIi2PJRGo/edit"
  ],
  "諸机戦": [
    "https://docs.google.com/document/d/1exkq9fKPCfYL27YYmA420mzmI64DlXChsUcuskhL_oo/edit"
  ],
  "踏越え論": [
    "https://docs.google.com/document/d/1AIp9bWUEFsieKhm4YRK8NBMXTnrufnS0-KZ2COSH2wU/edit",
    "https://docs.google.com/document/d/1MVGriJ8UV_qSQmfQAOORJ05vSgRX4tYNvavZWkdfu3M/edit"
  ],
  "異世界に転生したけど日本語が通じなかった": [
    "https://kakuyomu.jp/works/1177354054883808252"
  ],
  "連盟員速習": [
    "https://docs.google.com/document/d/1tehvujt9R0b2FQOvlRGrm1NycwwM3MKsVcfP8tj9gXY/edit"
  ],
  "国際母語の日": [
    "https://docs.google.com/document/d/1K9YPvsJ4N6c7CabLpFJhG1XxQ-DbybBDtNN_abFJW5A/edit"
  ],
  "アイル統一机戦書": [
    "https://docs.google.com/document/d/1hucBatoIvOQPu4rPglqiWqsDM9_6GAa6ZiuvSQKRIzI/edit",
    "https://docs.google.com/document/d/1yJLvWS_bQC3_EDToE5jUp0oDmNB_U6FRadsm0d97Cis/edit",
    "https://docs.google.com/document/d/1je13nnmhomr_22MrV3ZCFwmpeFu4ZyIvu1mufxOxq1s/edit",
    "https://github.com/sozysozbot/cerke/blob/master/AIL%20PANIT%20LETI%20CETKAIK%20LETI%20KULANTE.pdf"
  ],
  "アイル統一机戦書記譜例": [
    "https://docs.google.com/document/d/1hucBatoIvOQPu4rPglqiWqsDM9_6GAa6ZiuvSQKRIzI/edit",
    "https://docs.google.com/document/d/1je13nnmhomr_22MrV3ZCFwmpeFu4ZyIvu1mufxOxq1s/edit"
  ],
  "国際共産歌詞": [
    "https://docs.google.com/document/d/1UQAPi3RST38-SjsaV5jE5YZGabIrUdt-ply8BWL5qaY/edit"
  ],
  "冠光歌詞": [
    "https://www.youtube.com/watch?v=tOu0kmzRKXE",
    "https://docs.google.com/document/d/18my20DWbx5uNrRP7ix_ZC6iGkcfSOWmGSPHPB4tcuKc/edit"
  ],
  "改良版アリス": [
    "https://docs.google.com/document/d/1G-xhtlGl-TGrFH6kHixg5-LRZ6gBGifSe3NHLcFk8Ss/edit"
  ],
  "東島通商語入門": [
    "https://docs.google.com/document/d/1G-xhtlGl-TGrFH6kHixg5-LRZ6gBGifSe3NHLcFk8Ss/edit"
  ],
  "パングラム": [
    "https://docs.google.com/spreadsheets/d/1GBBZcf6Ym84P8c4GfzgbqDDqE0jS8839S5zWdxLph2w/edit#gid=351330495"
  ],
  "地震速報": [
    "https://twitter.com/S_Y15/status/906185235783589888"
  ],
  "不信心者": [
    "https://drive.google.com/file/d/0B39blCYDRBu-Q0txclEtVFgycEk/view?usp=sharing&resourcekey=0-vIfxR_971U7E9VTDmtRDDA",
    "https://docs.google.com/document/d/1G-xhtlGl-TGrFH6kHixg5-LRZ6gBGifSe3NHLcFk8Ss/edit"
  ],
  "クレオール言語に関する一考察": [
    "https://drive.google.com/file/d/0B39blCYDRBu-Q0txclEtVFgycEk/view?usp=sharing&resourcekey=0-vIfxR_971U7E9VTDmtRDDA"
  ],
  "あいさつ": [
    "https://twitter.com/S_Y15/status/861960974512738304"
  ],
  "PMCFショーケース": [
    "https://docs.google.com/document/d/1IvZJSZ86LUWoqPXB3e5Jzw2FN2eRXIycbnVcR1YCS6A/edit",
    "https://www.youtube.com/watch?v=RWUayszPnis"
  ]
};