# Toribot
Tori.fi web scraper joka toimii discord-bottina. Botille syötetään linkki tori.fi hakuun, botti haravoi listaukset läpi ja lisää ne Discord-käyttäjän omaan .json tiedostoon. Botti päivittää listauksia 5min välein, ja mikäli toriin on tullut uusi listaus, botti lähettää tämän listauksen privaattiviestillä Discordissa.

Käyttää nodea botin pyörittämiseen ja https://github.com/request/request-promise http requesteihin

Tori.fi urlit muodossa https://www.tori.fi/koko_suomi/tietokoneet_ja_lisalaitteet/komponentit?ca=18&cg=5030&c=5038&w=3&st=s&st=k&st=u&st=h&st=g&st=b&com=graphic_card

Komennoilla !add, !mylistings, ja !remove pystyy hallinnoimaan omia tori.fi 

