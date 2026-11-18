export interface NgslWord {
  group: number;
  lemma: string;
  rank: number;
  sfi: string;
  freq: number;
  pos: string;
  pt: string;
}

export const NGSL_RAW = `1|the|1|87,85|60910|Artigo|o, a, os, as
1|be|2|86,86|48575|Verbo|ser; estar
1|and|3|84,88|30789|Conjunção|e
1|of|4|84,79|30126|Preposição|de
1|to|5|84,66|29272|Preposição|para; a
1|a|6|84,45|27872|Artigo|um, uma
1|in|7|83,25|21142|Preposição|em; dentro de
1|have|8|81,53|14210|Verbo|ter; haver
2|it|9|81,39|13772|Pronome|ele, ela, isso (coisa)
2|you|10|81,08|12810|Pronome|você, vocês; tu
2|he|11|80,42|11017|Pronome|ele
2|for|12|80,01|10025|Preposição|para; por
2|they|13|79,90|9764|Pronome|eles, elas
2|not|14|79,77|9494|Advérbio|não
2|that|15|79,37|8653|Pronome, Conjunção|aquele, aquilo, esse; que
2|we|16|79,24|8401|Pronome|nós; a gente
3|on|17|78,90|7763|Preposição|em; sobre
3|with|18|78,68|7381|Preposição|com
3|this|19|78,45|7003|Pronome|este, esta, isto
3|I|20|78,34|6820|Pronome|eu
3|do|21|78,33|6802|Verbo|fazer
3|as|22|78,29|6747|Conjunção, Preposição, Advérbio|como; enquanto; tão
3|at|23|77,46|5570|Preposição|em; a (lugar, hora)
3|she|24|77,16|5195|Pronome|ela
4|but|25|77,06|5087|Conjunção|mas; porém
4|from|26|76,63|4598|Preposição|de; desde
4|by|27|76,36|4323|Preposição|por; perto de; até (prazo)
4|will|28|76,23|4195|Verbo auxiliar, Substantivo|(forma o futuro); vontade
4|or|29|76,09|4060|Conjunção|ou
4|say|30|75,35|3425|Verbo|dizer
4|go|31|75,13|3260|Verbo|ir
4|so|32|75,09|3227|Advérbio, Conjunção|tão; então; por isso
5|all|33|75,02|3175|Pronome, Adjetivo|todo, todos; tudo
5|if|34|74,78|3009|Conjunção|se
5|one|35|74,77|2997|Numeral, Pronome|um; alguém
5|would|36|74,77|2997|Verbo auxiliar|(forma o condicional: -ria)
5|about|37|74,72|2967|Preposição, Advérbio|sobre; cerca de
5|can|38|74,61|2890|Verbo modal|poder; conseguir
5|which|39|74,60|2886|Pronome|qual; que, o qual
5|there|40|74,50|2820|Advérbio|lá, ali; (there is = há)
6|know|41|74,21|2634|Verbo|saber; conhecer
6|more|42|74,20|2631|Advérbio, Adjetivo|mais
6|get|43|74,10|2573|Verbo|conseguir; obter; ficar; chegar
6|who|44|74,04|2534|Pronome|quem; que
6|like|45|73,92|2465|Preposição, Verbo|como; gostar de
6|when|46|73,86|2435|Advérbio, Conjunção|quando
6|think|47|73,86|2433|Verbo|pensar; achar
6|make|48|73,73|2359|Verbo|fazer; fabricar
7|time|49|73,62|2302|Substantivo|tempo; vez; hora
7|see|50|73,48|2226|Verbo|ver
7|what|51|73,43|2204|Pronome|o que; qual
7|up|52|73,32|2150|Advérbio, Preposição|para cima; acima
7|some|53|73,28|2130|Pronome, Adjetivo|algum, alguns; um pouco de
7|other|54|73,22|2100|Adjetivo, Pronome|outro
7|out|55|73,15|2064|Advérbio|fora; para fora
7|good|56|73,09|2038|Adjetivo|bom
8|people|57|73,05|2019|Substantivo|pessoas; povo
8|year|58|72,90|1949|Substantivo|ano
8|take|59|72,73|1873|Verbo|pegar; levar; tomar
8|no|60|72,68|1854|Advérbio, Adjetivo|não; nenhum
8|well|61|72,64|1835|Advérbio, Interjeição|bem; bom...
8|because|62|72,61|1824|Conjunção|porque
8|very|63|72,53|1792|Advérbio|muito
8|just|64|72,43|1751|Advérbio|apenas; só; acabou de
9|come|65|72,29|1694|Verbo|vir
9|could|66|72,27|1688|Verbo modal|poderia; podia
9|work|67|72,24|1674|Substantivo, Verbo|trabalho; trabalhar; funcionar
9|use|68|72,19|1657|Verbo, Substantivo|usar; uso
9|than|69|72,02|1591|Conjunção|do que
9|now|70|71,94|1563|Advérbio|agora
9|then|71|71,91|1554|Advérbio|então; depois
9|also|72|71,91|1552|Advérbio|também
10|into|73|71,70|1477|Preposição|para dentro de; em
10|only|74|71,69|1475|Advérbio, Adjetivo|só, apenas; único
10|look|75|71,37|1370|Verbo, Substantivo|olhar; parecer; olhar (aparência)
10|want|76|71,31|1354|Verbo|querer
10|give|77|71,24|1332|Verbo|dar
10|first|78|71,21|1321|Numeral, Advérbio|primeiro; primeiramente
10|new|79|71,10|1290|Adjetivo|novo
10|way|80|71,07|1279|Substantivo|caminho; modo, jeito
11|find|81|70,92|1236|Verbo|encontrar, achar
11|over|82|70,92|1235|Preposição, Advérbio|sobre; acima de; terminado
11|any|83|70,88|1224|Pronome, Adjetivo|qualquer; algum, nenhum (neg.)
11|after|84|70,83|1210|Preposição, Conjunção|depois de; após
11|day|85|70,75|1187|Substantivo|dia
11|where|86|70,75|1187|Advérbio, Conjunção|onde
11|thing|87|70,65|1161|Substantivo|coisa
11|most|88|70,59|1146|Advérbio, Adjetivo|o mais; a maioria
12|should|89|70,54|1132|Verbo modal|deveria
12|need|90|70,53|1129|Verbo, Substantivo|precisar; necessidade
12|much|91|70,51|1125|Advérbio, Adjetivo|muito
12|right|92|70,47|1113|Adjetivo, Advérbio, Substantivo|certo; direito; direito (legal)
12|how|93|70,39|1093|Advérbio|como
12|back|94|70,22|1051|Advérbio, Substantivo|de volta; costas
12|mean|95|70,09|1021|Verbo|significar; querer dizer
12|even|96|69,95|988|Advérbio|até; mesmo; ainda
13|may|97|69,82|959|Verbo modal|poder (possibilidade, permissão)
13|here|98|69,77|947|Advérbio|aqui
13|many|99|69,75|945|Adjetivo, Pronome|muitos
13|such|100|69,71|936|Adjetivo, Pronome|tal; tão
13|last|101|69,62|917|Adjetivo, Verbo|último; passado; durar
13|child|102|69,59|910|Substantivo|criança; filho
13|tell|103|69,55|901|Verbo|contar; dizer
13|really|104|69,40|870|Advérbio|realmente; muito
14|call|105|69,39|869|Verbo, Substantivo|chamar; ligar; ligação
14|before|106|69,29|849|Preposição, Conjunção|antes de
14|company|107|69,25|842|Substantivo|empresa; companhia
14|through|108|69,23|838|Preposição|através de; por
14|down|109|69,21|833|Advérbio, Preposição|para baixo
14|show|110|69,18|827|Verbo, Substantivo|mostrar; espetáculo, programa
14|life|111|69,09|812|Substantivo|vida
14|man|112|69,07|807|Substantivo|homem
15|change|113|69,02|799|Verbo, Substantivo|mudar; mudança; troco
15|place|114|69,00|795|Substantivo, Verbo|lugar; colocar
15|long|115|68,98|791|Adjetivo|longo, comprido
15|between|116|68,94|784|Preposição|entre
15|feel|117|68,92|780|Verbo|sentir
15|too|118|68,82|763|Advérbio|também; demais
15|still|119|68,76|752|Advérbio|ainda
15|problem|120|68,65|733|Substantivo|problema
16|write|121|68,65|732|Verbo|escrever
16|same|122|68,58|721|Adjetivo|mesmo, igual
16|lot|123|68,54|715|Substantivo|monte (a lot = muito); lote
16|great|124|68,51|710|Adjetivo|ótimo; grande
16|try|125|68,45|699|Verbo|tentar; experimentar
16|leave|126|68,44|699|Verbo|deixar; sair, partir
16|number|127|68,44|698|Substantivo|número
16|both|128|68,42|695|Pronome|ambos, os dois
17|own|129|68,40|693|Adjetivo, Verbo|próprio; possuir
17|part|130|68,40|692|Substantivo|parte
17|point|131|68,35|684|Substantivo, Verbo|ponto; apontar
17|little|132|68,33|681|Adjetivo, Advérbio|pequeno; pouco
17|help|133|68,32|680|Verbo, Substantivo|ajudar; ajuda
17|ask|134|68,29|675|Verbo|perguntar; pedir
17|meet|135|68,26|671|Verbo|encontrar; conhecer (pessoa); reunir-se
17|start|136|68,26|669|Verbo, Substantivo|começar; início
18|talk|137|68,23|665|Verbo, Substantivo|falar, conversar; conversa
18|something|138|68,23|665|Pronome|algo, alguma coisa
18|put|139|68,16|655|Verbo|pôr, colocar
18|another|140|68,16|655|Pronome, Adjetivo|outro, mais um
18|become|141|68,15|654|Verbo|tornar-se, ficar
18|interest|142|68,15|653|Substantivo, Verbo|interesse; juros; interessar
18|country|143|68,15|653|Substantivo|país; campo
18|old|144|68,11|647|Adjetivo|velho; antigo
19|each|145|68,10|646|Pronome, Adjetivo|cada
19|school|146|68,05|638|Substantivo|escola
19|late|147|68,05|638|Adjetivo, Advérbio|atrasado; tarde; falecido
19|high|148|68,04|637|Adjetivo|alto
19|different|149|68,03|636|Adjetivo|diferente
19|off|150|68,00|630|Advérbio, Preposição|desligado; fora; longe de
19|next|151|67,92|620|Adjetivo|próximo; seguinte
19|end|152|67,92|619|Substantivo, Verbo|fim; terminar
20|live|153|67,84|608|Verbo, Adjetivo|viver, morar; ao vivo
20|why|154|67,83|607|Advérbio|por que
20|while|155|67,77|598|Conjunção, Substantivo|enquanto; um tempo
20|world|156|67,76|597|Substantivo|mundo
20|week|157|67,75|596|Substantivo|semana
20|play|158|67,73|593|Verbo, Substantivo|jogar; brincar; tocar; peça (teatro)
20|might|159|67,68|587|Verbo modal|poderia; talvez
20|must|160|67,68|586|Verbo modal|dever; ter que
21|home|161|67,67|585|Substantivo, Advérbio|casa, lar; em casa
21|never|162|67,63|580|Advérbio|nunca
21|include|163|67,60|575|Verbo|incluir
21|course|164|67,60|575|Substantivo|curso; rumo (of course = claro)
21|house|165|67,57|572|Substantivo|casa
21|report|166|67,56|570|Substantivo, Verbo|relatório; reportagem; relatar
21|group|167|67,55|569|Substantivo|grupo
21|case|168|67,55|569|Substantivo|caso; estojo
22|woman|169|67,55|568|Substantivo|mulher
22|around|170|67,54|568|Preposição, Advérbio|ao redor de; cerca de; por aí
22|book|171|67,53|566|Substantivo, Verbo|livro; reservar
22|family|172|67,52|565|Substantivo|família
22|seem|173|67,50|562|Verbo|parecer
22|let|174|67,44|555|Verbo|deixar, permitir
22|again|175|67,44|554|Advérbio|de novo, novamente
22|kind|176|67,43|554|Substantivo, Adjetivo|tipo; gentil
23|keep|177|67,41|551|Verbo|manter; guardar; continuar
23|hear|178|67,37|546|Verbo|ouvir
23|system|179|67,36|545|Substantivo|sistema
23|every|180|67,36|545|Adjetivo|cada; todo
23|question|181|67,34|542|Substantivo, Verbo|pergunta; questão; questionar
23|during|182|67,32|540|Preposição|durante
23|always|183|67,25|531|Advérbio|sempre
23|big|184|67,22|527|Adjetivo|grande
24|set|185|67,21|526|Verbo, Substantivo|pôr; definir; conjunto
24|small|186|67,20|525|Adjetivo|pequeno
24|study|187|67,19|524|Verbo, Substantivo|estudar; estudo
24|follow|188|67,17|521|Verbo|seguir
24|begin|189|67,14|518|Verbo|começar
24|important|190|67,14|518|Adjetivo|importante
24|since|191|67,12|515|Preposição, Conjunção|desde; já que
24|run|192|67,08|510|Verbo|correr; administrar; funcionar
25|under|193|67,07|509|Preposição|sob; embaixo de; menos de
25|turn|194|67,07|509|Verbo, Substantivo|virar; girar; vez
25|few|195|67,07|509|Adjetivo, Pronome|poucos (a few = alguns)
25|bring|196|67,00|502|Verbo|trazer
25|early|197|66,98|499|Adjetivo, Advérbio|cedo; antecipado
25|hand|198|66,97|497|Substantivo, Verbo|mão; entregar
25|state|199|66,94|494|Substantivo, Verbo|estado; declarar
25|move|200|66,93|493|Verbo, Substantivo|mover; mudar-se; movimento
26|money|201|66,92|492|Substantivo|dinheiro
26|fact|202|66,86|486|Substantivo|fato
26|however|203|66,80|479|Advérbio|no entanto, porém
26|area|204|66,78|477|Substantivo|área
26|provide|205|66,78|476|Verbo|fornecer, prover
26|name|206|66,74|472|Substantivo, Verbo|nome; nomear
26|read|207|66,73|471|Verbo|ler
26|friend|208|66,70|468|Substantivo|amigo
27|month|209|66,70|468|Substantivo|mês
27|large|210|66,67|464|Adjetivo|grande
27|business|211|66,67|464|Substantivo|negócio; empresa
27|without|212|66,64|461|Preposição|sem
27|information|213|66,62|459|Substantivo|informação
27|open|214|66,61|459|Adjetivo, Verbo|aberto; abrir
27|order|215|66,59|456|Substantivo, Verbo|ordem; pedido; encomendar
27|government|216|66,58|455|Substantivo|governo
28|word|217|66,58|455|Substantivo|palavra
28|issue|218|66,56|453|Substantivo, Verbo|questão; problema; emitir
28|market|219|66,53|450|Substantivo|mercado
28|pay|220|66,51|447|Verbo, Substantivo|pagar; salário
28|build|221|66,50|446|Verbo|construir
28|hold|222|66,45|442|Verbo|segurar; manter; realizar (evento)
28|service|223|66,44|440|Substantivo|serviço
28|against|224|66,39|436|Preposição|contra
29|believe|225|66,38|435|Verbo|acreditar
29|second|226|66,36|433|Numeral, Substantivo|segundo
29|though|227|66,34|430|Conjunção, Advérbio|embora; porém
29|yes|228|66,33|430|Advérbio|sim
29|love|229|66,30|427|Substantivo, Verbo|amor; amar
29|increase|230|66,28|425|Verbo, Substantivo|aumentar; aumento
29|job|231|66,28|425|Substantivo|emprego; trabalho
29|plan|232|66,28|425|Substantivo, Verbo|plano; planejar
30|result|233|66,27|424|Substantivo, Verbo|resultado; resultar
30|away|234|66,27|424|Advérbio|longe; embora
30|example|235|66,24|420|Substantivo|exemplo
30|happen|236|66,23|420|Verbo|acontecer
30|offer|237|66,21|418|Verbo, Substantivo|oferecer; oferta
30|young|238|66,20|417|Adjetivo|jovem
30|close|239|66,19|416|Verbo, Adjetivo|fechar; próximo
30|program|240|66,17|414|Substantivo|programa
31|lead|241|66,13|410|Verbo|liderar; levar a
31|buy|242|66,07|405|Verbo|comprar
31|understand|243|66,05|403|Verbo|entender
31|thank|244|66,01|399|Verbo|agradecer
31|far|245|66,00|398|Advérbio, Adjetivo|longe; distante
31|today|246|65,94|392|Advérbio, Substantivo|hoje
31|hour|247|65,93|391|Substantivo|hora
31|student|248|65,92|391|Substantivo|estudante, aluno
32|face|249|65,91|390|Substantivo, Verbo|rosto; enfrentar
32|hope|250|65,89|388|Verbo, Substantivo|esperar (ter esperança); esperança
32|idea|251|65,87|387|Substantivo|ideia
32|cost|252|65,86|386|Substantivo, Verbo|custo; custar
32|less|253|65,86|385|Advérbio, Adjetivo|menos
32|room|254|65,85|385|Substantivo|quarto; sala; espaço
32|until|255|65,83|383|Preposição, Conjunção|até; até que
32|reason|256|65,83|383|Substantivo|razão, motivo
33|form|257|65,79|379|Substantivo, Verbo|formulário; forma; formar
33|spend|258|65,78|378|Verbo|gastar; passar (tempo)
33|head|259|65,77|378|Substantivo, Verbo|cabeça; chefe; dirigir-se
33|car|260|65,77|377|Substantivo|carro
33|learn|261|65,74|375|Verbo|aprender
33|level|262|65,71|373|Substantivo|nível
33|person|263|65,66|368|Substantivo|pessoa
33|experience|264|65,63|365|Substantivo, Verbo|experiência; vivenciar
34|once|265|65,62|365|Advérbio, Conjunção|uma vez; assim que
34|member|266|65,61|364|Substantivo|membro
34|enough|267|65,60|363|Adjetivo, Advérbio|suficiente; o bastante
34|bad|268|65,59|363|Adjetivo|ruim, mau
34|city|269|65,59|362|Substantivo|cidade
34|night|270|65,58|361|Substantivo|noite
34|able|271|65,57|361|Adjetivo|capaz (be able to = conseguir)
34|support|272|65,55|359|Verbo, Substantivo|apoiar; apoio; suporte
35|whether|273|65,55|359|Conjunção|se (dúvida)
35|line|274|65,54|358|Substantivo|linha; fila
35|present|275|65,54|358|Substantivo, Adjetivo, Verbo|presente; apresentar
35|side|276|65,51|356|Substantivo|lado
35|quite|277|65,50|354|Advérbio|bastante; completamente
35|although|278|65,46|351|Conjunção|embora
35|sure|279|65,45|351|Adjetivo|certo, seguro
35|term|280|65,44|350|Substantivo|termo; prazo; período letivo
36|least|281|65,44|350|Advérbio, Adjetivo|o mínimo (at least = pelo menos)
36|age|282|65,43|349|Substantivo|idade; era
36|low|283|65,43|349|Adjetivo|baixo
36|speak|284|65,42|348|Verbo|falar
36|within|285|65,40|347|Preposição|dentro de
36|process|286|65,40|346|Substantivo, Verbo|processo; processar
36|public|287|65,35|343|Adjetivo, Substantivo|público
36|often|288|65,33|341|Advérbio|frequentemente
37|train|289|65,29|338|Substantivo, Verbo|trem; treinar
37|possible|290|65,28|337|Adjetivo|possível
37|actually|291|65,28|337|Advérbio|na verdade
37|rather|292|65,27|336|Advérbio|bastante; de preferência (rather than = em vez de)
37|view|293|65,26|336|Substantivo, Verbo|vista; opinião; ver
37|together|294|65,24|334|Advérbio|juntos
37|consider|295|65,24|334|Verbo|considerar
37|price|296|65,14|327|Substantivo|preço
38|parent|297|65,14|326|Substantivo|pai ou mãe (parents = pais)
38|hard|298|65,12|325|Adjetivo, Advérbio|difícil; duro; com esforço
38|party|299|65,08|322|Substantivo|festa; partido; parte
38|local|300|65,06|321|Adjetivo|local
38|control|301|65,05|320|Substantivo, Verbo|controle; controlar
38|already|302|65,02|318|Advérbio|já
38|concern|303|65,02|317|Substantivo, Verbo|preocupação; dizer respeito a
38|product|304|65,01|317|Substantivo|produto
39|lose|305|65,00|316|Verbo|perder
39|story|306|64,98|315|Substantivo|história; andar (prédio)
39|almost|307|64,98|315|Advérbio|quase
39|continue|308|64,96|314|Verbo|continuar
39|stand|309|64,95|313|Verbo|ficar de pé; suportar
39|whole|310|64,95|313|Adjetivo|inteiro, todo
39|yet|311|64,95|313|Advérbio, Conjunção|ainda; já; contudo
39|rate|312|64,94|312|Substantivo|taxa; índice
40|care|313|64,93|311|Substantivo, Verbo|cuidado; importar-se
40|expect|314|64,93|311|Verbo|esperar (prever)
40|effect|315|64,93|311|Substantivo|efeito
40|sort|316|64,92|311|Substantivo, Verbo|tipo; classificar
40|ever|317|64,92|311|Advérbio|já; alguma vez; sempre
40|anything|318|64,92|310|Pronome|qualquer coisa; nada (neg.)
40|cause|319|64,90|309|Substantivo, Verbo|causa; causar
40|fall|320|64,89|309|Verbo, Substantivo|cair; queda; outono (EUA)
41|deal|321|64,89|309|Substantivo, Verbo|acordo, negócio; lidar
41|water|322|64,87|307|Substantivo|água
41|send|323|64,86|306|Verbo|enviar
41|allow|324|64,84|305|Verbo|permitir
41|soon|325|64,84|304|Advérbio|logo, em breve
41|watch|326|64,80|302|Verbo, Substantivo|assistir; observar; relógio de pulso
41|base|327|64,78|300|Substantivo, Verbo|base; basear
41|probably|328|64,75|299|Advérbio|provavelmente
42|suggest|329|64,74|298|Verbo|sugerir
42|past|330|64,73|297|Substantivo, Adjetivo|passado
42|power|331|64,72|296|Substantivo|poder; energia
42|test|332|64,71|296|Substantivo, Verbo|teste, prova; testar
42|visit|333|64,70|295|Verbo, Substantivo|visitar; visita
42|center|334|64,70|295|Substantivo|centro
42|grow|335|64,69|294|Verbo|crescer; cultivar
42|nothing|336|64,68|294|Pronome|nada
43|return|337|64,68|294|Verbo, Substantivo|voltar; devolver; retorno
43|mother|338|64,67|293|Substantivo|mãe
43|walk|339|64,63|291|Verbo, Substantivo|caminhar, andar; caminhada
43|matter|340|64,63|290|Substantivo, Verbo|assunto; matéria; importar
43|mind|341|64,62|290|Substantivo, Verbo|mente; importar-se
43|value|342|64,61|289|Substantivo, Verbo|valor; valorizar
43|office|343|64,59|288|Substantivo|escritório; cargo
43|record|344|64,59|287|Substantivo, Verbo|registro; recorde; gravar
44|stay|345|64,57|286|Verbo|ficar, permanecer
44|force|346|64,57|286|Substantivo, Verbo|força; forçar
44|stop|347|64,55|285|Verbo, Substantivo|parar; parada
44|several|348|64,54|285|Adjetivo|vários
44|light|349|64,53|284|Substantivo, Adjetivo|luz; leve; claro
44|develop|350|64,51|282|Verbo|desenvolver
44|remember|351|64,50|282|Verbo|lembrar
44|bit|352|64,49|281|Substantivo|pedaço; pouco (a bit = um pouco)
45|share|353|64,48|281|Verbo, Substantivo|compartilhar; parte; ação (bolsa)
45|real|354|64,47|280|Adjetivo|real, verdadeiro
45|answer|355|64,46|279|Substantivo, Verbo|resposta; responder
45|sit|356|64,44|278|Verbo|sentar
45|figure|357|64,43|278|Substantivo, Verbo|número; figura; calcular (figure out = descobrir)
45|letter|358|64,43|277|Substantivo|carta; letra
45|decide|359|64,41|276|Verbo|decidir
45|language|360|64,39|275|Substantivo|língua, idioma; linguagem
46|subject|361|64,35|273|Substantivo|assunto; matéria; sujeito
46|class|362|64,35|272|Substantivo|aula; turma; classe
46|development|363|64,31|270|Substantivo|desenvolvimento
46|town|364|64,31|269|Substantivo|cidade (pequena)
46|half|365|64,29|269|Substantivo|metade
46|minute|366|64,28|268|Substantivo|minuto
46|food|367|64,28|268|Substantivo|comida
46|break|368|64,28|268|Verbo, Substantivo|quebrar; pausa, intervalo
47|clear|369|64,25|266|Adjetivo, Verbo|claro; limpar; liberar
47|future|370|64,24|266|Substantivo, Adjetivo|futuro
47|either|371|64,24|266|Pronome, Conjunção|qualquer um (dos dois); ou; também não
47|ago|372|64,24|265|Advérbio|atrás (2 dias atrás)
47|per|373|64,24|265|Preposição|por (por pessoa)
47|remain|374|64,24|265|Verbo|permanecer
47|top|375|64,23|265|Substantivo, Adjetivo|topo; superior
47|among|376|64,23|265|Preposição|entre (vários)
48|win|377|64,21|264|Verbo|ganhar, vencer
48|color|378|64,20|263|Substantivo|cor
48|involve|379|64,16|260|Verbo|envolver
48|reach|380|64,15|260|Verbo|alcançar; chegar a
48|social|381|64,15|260|Adjetivo|social
48|period|382|64,13|259|Substantivo|período
48|across|383|64,12|258|Preposição|através de; do outro lado
48|note|384|64,12|258|Substantivo, Verbo|nota; bilhete; anotar
49|history|385|64,12|258|Substantivo|história
49|create|386|64,11|258|Verbo|criar
49|drive|387|64,11|258|Verbo|dirigir
49|along|388|64,10|257|Preposição|ao longo de
49|type|389|64,09|257|Substantivo, Verbo|tipo; digitar
49|sound|390|64,08|256|Substantivo, Verbo|som; soar, parecer
49|eye|391|64,07|256|Substantivo|olho
49|music|392|64,07|255|Substantivo|música
50|game|393|64,07|255|Substantivo|jogo
50|political|394|64,06|255|Adjetivo|político
50|free|395|64,06|255|Adjetivo|livre; grátis
50|receive|396|64,05|254|Verbo|receber
50|moment|397|64,05|254|Substantivo|momento
50|sale|398|64,04|254|Substantivo|venda; liquidação
50|policy|399|64,04|253|Substantivo|política (diretriz); apólice
50|further|400|63,99|251|Advérbio, Adjetivo|mais longe; adicional
51|body|401|63,98|250|Substantivo|corpo
51|require|402|63,97|249|Verbo|exigir, requerer
51|wait|403|63,96|249|Verbo|esperar (aguardar)
51|general|404|63,95|248|Adjetivo, Substantivo|geral; general
51|appear|405|63,95|248|Verbo|aparecer; parecer
51|toward|406|63,95|248|Preposição|em direção a; em relação a
51|team|407|63,95|248|Substantivo|equipe, time
51|easy|408|63,95|248|Adjetivo|fácil
52|individual|409|63,95|248|Adjetivo, Substantivo|individual; indivíduo
52|full|410|63,95|248|Adjetivo|cheio; completo
52|black|411|63,94|248|Adjetivo|preto, negro
52|sense|412|63,92|247|Substantivo, Verbo|sentido; perceber
52|perhaps|413|63,91|246|Advérbio|talvez
52|add|414|63,89|245|Verbo|adicionar, somar
52|rule|415|63,88|245|Substantivo, Verbo|regra; governar
52|pass|416|63,86|243|Verbo|passar; ser aprovado
53|produce|417|63,86|243|Verbo|produzir
53|sell|418|63,86|243|Verbo|vender
53|short|419|63,81|241|Adjetivo|curto; baixo (pessoa)
53|agree|420|63,81|240|Verbo|concordar
53|law|421|63,79|239|Substantivo|lei; direito
53|everything|422|63,77|238|Pronome|tudo
53|research|423|63,75|237|Substantivo, Verbo|pesquisa; pesquisar
53|cover|424|63,73|236|Verbo, Substantivo|cobrir; capa
54|paper|425|63,73|236|Substantivo|papel; jornal; artigo
54|position|426|63,72|236|Substantivo|posição; cargo
54|near|427|63,72|236|Preposição, Adjetivo|perto de; próximo
54|human|428|63,72|235|Adjetivo, Substantivo|humano
54|computer|429|63,72|235|Substantivo|computador
54|situation|430|63,70|235|Substantivo|situação
54|staff|431|63,70|234|Substantivo|equipe, funcionários
54|activity|432|63,68|234|Substantivo|atividade
55|film|433|63,66|232|Substantivo|filme
55|morning|434|63,65|232|Substantivo|manhã
55|war|435|63,63|231|Substantivo|guerra
55|account|436|63,63|231|Substantivo|conta; relato
55|shop|437|63,62|230|Substantivo, Verbo|loja; fazer compras
55|major|438|63,59|229|Adjetivo|principal; importante
55|someone|439|63,58|228|Pronome|alguém
55|above|440|63,58|228|Preposição, Advérbio|acima de
56|design|441|63,58|228|Substantivo, Verbo|design, projeto; projetar
56|event|442|63,57|228|Substantivo|evento
56|special|443|63,57|228|Adjetivo|especial
56|sometimes|444|63,57|227|Advérbio|às vezes
56|condition|445|63,54|226|Substantivo|condição
56|carry|446|63,54|226|Verbo|carregar; levar
56|choose|447|63,53|225|Verbo|escolher
56|father|448|63,51|225|Substantivo|pai
57|decision|449|63,51|224|Substantivo|decisão
57|table|450|63,50|224|Substantivo|mesa; tabela
57|certain|451|63,49|223|Adjetivo|certo; determinado
57|forward|452|63,48|223|Advérbio|para frente
57|main|453|63,48|223|Adjetivo|principal
57|die|454|63,47|222|Verbo|morrer
57|bear|455|63,45|222|Verbo, Substantivo|suportar; dar à luz; urso
57|cut|456|63,45|221|Verbo, Substantivo|cortar; corte
58|describe|457|63,43|220|Verbo|descrever
58|himself|458|63,42|220|Pronome|ele mesmo; se
58|available|459|63,42|220|Adjetivo|disponível
58|especially|460|63,42|220|Advérbio|especialmente
58|strong|461|63,38|218|Adjetivo|forte
58|rise|462|63,38|218|Verbo, Substantivo|subir; aumento
58|girl|463|63,37|217|Substantivo|menina, garota
58|maybe|464|63,37|217|Advérbio|talvez
59|community|465|63,37|217|Substantivo|comunidade
59|else|466|63,34|216|Advérbio|mais; outro (someone else = outra pessoa)
59|particular|467|63,33|215|Adjetivo|particular, específico
59|role|468|63,33|215|Substantivo|papel, função
59|join|469|63,33|215|Verbo|juntar-se a; entrar em
59|difficult|470|63,32|215|Adjetivo|difícil
59|please|471|63,28|213|Advérbio, Verbo|por favor; agradar
59|detail|472|63,28|213|Substantivo|detalhe
60|difference|473|63,27|212|Substantivo|diferença
60|action|474|63,21|210|Substantivo|ação
60|health|475|63,21|209|Substantivo|saúde
60|eat|476|63,19|209|Verbo|comer
60|step|477|63,18|208|Substantivo|passo; degrau
60|true|478|63,17|208|Adjetivo|verdadeiro
60|phone|479|63,16|207|Substantivo|telefone
60|themselves|480|63,16|207|Pronome|eles mesmos; se
61|draw|481|63,15|207|Verbo|desenhar; puxar; atrair
61|white|482|63,14|206|Adjetivo|branco
61|date|483|63,13|205|Substantivo|data; encontro
61|practice|484|63,12|205|Substantivo, Verbo|prática; praticar
61|model|485|63,12|205|Substantivo|modelo
61|raise|486|63,11|205|Verbo|levantar; aumentar; criar (filhos)
61|customer|487|63,11|205|Substantivo|cliente
61|front|488|63,07|203|Substantivo|frente
62|explain|489|63,06|202|Verbo|explicar
62|door|490|63,05|202|Substantivo|porta
62|outside|491|63,02|200|Advérbio, Preposição|lá fora; fora de
62|behind|492|63,01|200|Preposição|atrás de
62|economic|493|62,99|199|Adjetivo|econômico
62|site|494|62,98|199|Substantivo|local; site
62|approach|495|62,98|199|Substantivo, Verbo|abordagem; aproximar-se
62|teacher|496|62,98|199|Substantivo|professor
63|land|497|62,94|197|Substantivo, Verbo|terra; terreno; aterrissar
63|charge|498|62,94|197|Substantivo, Verbo|cobrança; acusação; carregar (bateria); cobrar
63|finally|499|62,93|197|Advérbio|finalmente
63|sign|500|62,93|197|Substantivo, Verbo|sinal; placa; assinar
63|claim|501|62,93|196|Verbo, Substantivo|alegar; reivindicar; reivindicação
63|relationship|502|62,93|196|Substantivo|relacionamento
63|travel|503|62,91|195|Verbo, Substantivo|viajar; viagem
63|enjoy|504|62,89|195|Verbo|aproveitar; gostar de
64|death|505|62,89|194|Substantivo|morte
64|nice|506|62,86|193|Adjetivo|legal; agradável
64|amount|507|62,86|193|Substantivo|quantidade; quantia
64|improve|508|62,83|192|Verbo|melhorar
64|picture|509|62,83|192|Substantivo|foto; imagem; quadro
64|boy|510|62,83|192|Substantivo|menino, garoto
64|regard|511|62,82|191|Verbo, Substantivo|considerar; consideração (regards = cumprimentos)
64|organization|512|62,82|191|Substantivo|organização
65|happy|513|62,81|191|Adjetivo|feliz
65|couple|514|62,81|191|Substantivo|casal; par (a couple of = alguns)
65|act|515|62,80|190|Verbo, Substantivo|agir; atuar; ato; lei
65|range|516|62,79|190|Substantivo|faixa; gama, variedade
65|quality|517|62,78|190|Substantivo|qualidade
65|project|518|62,78|190|Substantivo|projeto
65|round|519|62,77|189|Adjetivo, Substantivo|redondo; rodada
65|opportunity|520|62,76|189|Substantivo|oportunidade
66|road|521|62,76|189|Substantivo|estrada; rua
66|accord|522|62,74|188|Substantivo, Verbo|acordo (according to = de acordo com)
66|list|523|62,73|187|Substantivo, Verbo|lista; listar
66|wish|524|62,73|187|Verbo, Substantivo|desejar; desejo
66|therefore|525|62,72|187|Advérbio|portanto
66|wear|526|62,71|187|Verbo|vestir, usar (roupa)
66|fund|527|62,71|187|Substantivo, Verbo|fundo; financiar
66|rest|528|62,71|186|Substantivo, Verbo|descanso; resto; descansar
67|kid|529|62,70|186|Substantivo|criança
67|industry|530|62,68|185|Substantivo|indústria
67|education|531|62,67|185|Substantivo|educação
67|measure|532|62,67|185|Verbo, Substantivo|medir; medida
67|kill|533|62,65|184|Verbo|matar
67|serve|534|62,64|184|Verbo|servir
67|likely|535|62,62|183|Adjetivo|provável
67|certainly|536|62,59|182|Advérbio|certamente
68|national|537|62,58|181|Adjetivo|nacional
68|itself|538|62,57|181|Pronome|ele mesmo, si mesmo; se
68|teach|539|62,57|181|Verbo|ensinar
68|field|540|62,57|181|Substantivo|campo; área
68|security|541|62,54|180|Substantivo|segurança
68|air|542|62,53|179|Substantivo|ar
68|benefit|543|62,53|179|Substantivo, Verbo|benefício; beneficiar
68|trade|544|62,52|179|Substantivo, Verbo|comércio; negociar
69|risk|545|62,52|179|Substantivo|risco
69|news|546|62,51|178|Substantivo|notícia(s)
69|standard|547|62,50|178|Substantivo, Adjetivo|padrão
69|vote|548|62,49|177|Substantivo, Verbo|voto; votar
69|percent|549|62,49|177|Substantivo|por cento
69|focus|550|62,48|177|Substantivo, Verbo|foco; focar
69|stage|551|62,47|177|Substantivo|etapa, fase; palco
69|space|552|62,46|176|Substantivo|espaço
70|instead|553|62,46|176|Advérbio|em vez disso
70|realize|554|62,46|176|Verbo|perceber, dar-se conta; realizar
70|usually|555|62,44|175|Advérbio|geralmente
70|data|556|62,42|174|Substantivo|dados
70|single|557|62,41|174|Adjetivo|único; solteiro
70|address|558|62,37|173|Substantivo, Verbo|endereço; abordar, tratar
70|performance|559|62,36|172|Substantivo|desempenho; apresentação
70|chance|560|62,36|172|Substantivo|chance, oportunidade; acaso
71|accept|561|62,36|172|Verbo|aceitar
71|society|562|62,35|172|Substantivo|sociedade
71|technology|563|62,35|172|Substantivo|tecnologia
71|mention|564|62,35|172|Verbo|mencionar
71|choice|565|62,33|171|Substantivo|escolha
71|save|566|62,33|171|Verbo|salvar; economizar, poupar
71|common|567|62,32|170|Adjetivo|comum
71|culture|568|62,29|170|Substantivo|cultura
72|total|569|62,28|169|Adjetivo, Substantivo|total
72|demand|570|62,27|169|Substantivo, Verbo|demanda, procura; exigir
72|material|571|62,26|168|Substantivo|material
72|limit|572|62,25|168|Substantivo, Verbo|limite; limitar
72|listen|573|62,25|168|Verbo|escutar, ouvir
72|due|574|62,23|167|Adjetivo|devido; com vencimento (due to = devido a)
72|wrong|575|62,23|167|Adjetivo|errado
72|foot|576|62,22|167|Substantivo|pé
73|effort|577|62,22|167|Substantivo|esforço
73|attention|578|62,21|166|Substantivo|atenção
73|upon|579|62,21|166|Preposição|sobre; em
73|check|580|62,20|166|Verbo, Substantivo|verificar, conferir; cheque; conta
73|complete|581|62,20|166|Adjetivo, Verbo|completo; completar
73|lie|582|62,19|166|Verbo, Substantivo|mentir; deitar-se; mentira
73|pick|583|62,19|166|Verbo|escolher; pegar, colher
73|reduce|584|62,19|165|Verbo|reduzir
74|personal|585|62,19|165|Adjetivo|pessoal
74|ground|586|62,18|165|Substantivo|chão; solo; terreno
74|animal|587|62,17|165|Substantivo|animal
74|arrive|588|62,17|165|Verbo|chegar
74|patient|589|62,17|165|Substantivo, Adjetivo|paciente
74|current|590|62,15|164|Adjetivo|atual
74|century|591|62,14|163|Substantivo|século
74|evidence|592|62,13|163|Substantivo|prova, evidência
75|exist|593|62,13|163|Verbo|existir
75|similar|594|62,12|163|Adjetivo|semelhante
75|fight|595|62,12|163|Verbo, Substantivo|lutar, brigar; luta, briga
75|leader|596|62,12|163|Substantivo|líder
75|fine|597|62,11|162|Adjetivo, Substantivo|bem; ótimo; multa
75|street|598|62,11|162|Substantivo|rua
75|former|599|62,10|162|Adjetivo|antigo, ex-
75|contact|600|62,09|162|Substantivo, Verbo|contato; contatar
76|particularly|601|62,09|162|Advérbio|particularmente
76|wife|602|62,06|161|Substantivo|esposa
76|sport|603|62,06|161|Substantivo|esporte
76|prepare|604|62,04|160|Verbo|preparar
76|discuss|605|62,03|160|Verbo|discutir, debater
76|response|606|62,03|159|Substantivo|resposta
76|voice|607|62,02|159|Substantivo|voz
76|piece|608|62,01|159|Substantivo|pedaço; peça
77|finish|609|62,00|158|Verbo|terminar
77|suppose|610|61,97|157|Verbo|supor
77|apply|611|61,97|157|Verbo|aplicar; candidatar-se
77|president|612|61,97|157|Substantivo|presidente
77|fire|613|61,96|157|Substantivo, Verbo|fogo; incêndio; demitir
77|compare|614|61,95|157|Verbo|comparar
77|court|615|61,94|156|Substantivo|tribunal; quadra
77|police|616|61,93|156|Substantivo|polícia
78|store|617|61,92|156|Substantivo, Verbo|loja; armazenar
78|poor|618|61,92|156|Adjetivo|pobre; ruim
78|knowledge|619|61,91|155|Substantivo|conhecimento
78|laugh|620|61,91|155|Verbo, Substantivo|rir; risada
78|arm|621|61,90|155|Substantivo|braço
78|heart|622|61,90|155|Substantivo|coração
78|source|623|61,90|155|Substantivo|fonte
78|employee|624|61,89|154|Substantivo|funcionário, empregado
79|manage|625|61,87|154|Verbo|gerenciar; conseguir
79|simply|626|61,86|153|Advérbio|simplesmente
79|bank|627|61,85|153|Substantivo|banco (financeiro); margem (rio)
79|firm|628|61,84|153|Substantivo, Adjetivo|empresa, firma; firme
79|cell|629|61,84|153|Substantivo|célula; cela; celular
79|article|630|61,81|152|Substantivo|artigo
79|fast|631|61,80|151|Adjetivo, Advérbio|rápido; rapidamente
79|attack|632|61,79|151|Substantivo, Verbo|ataque; atacar
80|foreign|633|61,79|151|Adjetivo|estrangeiro
80|surprise|634|61,78|151|Substantivo, Verbo|surpresa; surpreender
80|feature|635|61,77|150|Substantivo|característica; recurso
80|factor|636|61,77|150|Substantivo|fator
80|pretty|637|61,76|150|Advérbio, Adjetivo|bastante; bonito
80|recently|638|61,76|150|Advérbio|recentemente
80|affect|639|61,76|150|Verbo|afetar
80|drop|640|61,75|150|Verbo, Substantivo|deixar cair; cair; gota; queda
81|recent|641|61,74|149|Adjetivo|recente
81|relate|642|61,74|149|Verbo|relacionar
81|official|643|61,73|149|Adjetivo, Substantivo|oficial; funcionário público
81|financial|644|61,73|149|Adjetivo|financeiro
81|miss|645|61,72|149|Verbo|sentir falta; perder (ônibus); errar
81|art|646|61,72|149|Substantivo|arte
81|campaign|647|61,71|148|Substantivo|campanha
81|private|648|61,71|148|Adjetivo|privado; particular
82|pause|649|61,70|148|Substantivo, Verbo|pausa; pausar
82|everyone|650|61,69|148|Pronome|todos, todo mundo
82|forget|651|61,68|147|Verbo|esquecer
82|page|652|61,68|147|Substantivo|página
82|worry|653|61,68|147|Verbo, Substantivo|preocupar-se; preocupação
82|summer|654|61,67|147|Substantivo|verão
82|drink|655|61,66|147|Verbo, Substantivo|beber; bebida
82|opinion|656|61,66|147|Substantivo|opinião
83|park|657|61,65|146|Substantivo, Verbo|parque; estacionar
83|represent|658|61,64|146|Verbo|representar
83|key|659|61,64|146|Substantivo, Adjetivo|chave; essencial
83|inside|660|61,62|145|Preposição, Advérbio|dentro de; dentro
83|manager|661|61,60|145|Substantivo|gerente
83|international|662|61,59|144|Adjetivo|internacional
83|contain|663|61,58|144|Verbo|conter
83|notice|664|61,56|143|Verbo, Substantivo|notar, perceber; aviso
84|wonder|665|61,56|143|Verbo, Substantivo|perguntar-se; maravilha
84|nature|666|61,55|143|Substantivo|natureza
84|structure|667|61,55|143|Substantivo|estrutura
84|section|668|61,54|142|Substantivo|seção
84|myself|669|61,53|142|Pronome|eu mesmo; me
84|exactly|670|61,52|142|Advérbio|exatamente
84|plant|671|61,52|142|Substantivo, Verbo|planta; fábrica, usina; plantar
84|paint|672|61,51|142|Substantivo, Verbo|tinta; pintar
85|worker|673|61,50|141|Substantivo|trabalhador
85|press|674|61,50|141|Verbo, Substantivo|pressionar, apertar; imprensa
85|whatever|675|61,50|141|Pronome|o que quer que; qualquer
85|necessary|676|61,50|141|Adjetivo|necessário
85|region|677|61,48|141|Substantivo|região
85|growth|678|61,46|140|Substantivo|crescimento
85|evening|679|61,46|140|Substantivo|noite (início), fim de tarde
85|influence|680|61,46|140|Substantivo, Verbo|influência; influenciar
86|respect|681|61,46|140|Substantivo, Verbo|respeito; respeitar
86|various|682|61,46|140|Adjetivo|vários, diversos
86|catch|683|61,45|140|Verbo|pegar; apanhar
86|thus|684|61,43|139|Advérbio|assim; portanto
86|skill|685|61,43|139|Substantivo|habilidade
86|attempt|686|61,42|139|Substantivo, Verbo|tentativa; tentar
86|son|687|61,42|139|Substantivo|filho
86|simple|688|61,41|138|Adjetivo|simples
87|medium|689|61,41|138|Adjetivo, Substantivo|médio; meio
87|average|690|61,41|138|Adjetivo, Substantivo|médio; média
87|stock|691|61,40|138|Substantivo|estoque; ações (bolsa)
87|management|692|61,39|138|Substantivo|gestão, administração; gerência
87|character|693|61,38|138|Substantivo|personagem; caráter
87|bed|694|61,38|137|Substantivo|cama
87|hit|695|61,38|137|Verbo, Substantivo|bater; atingir; sucesso
87|establish|696|61,37|137|Verbo|estabelecer
88|indeed|697|61,36|137|Advérbio|de fato, realmente
88|final|698|61,36|137|Adjetivo|final
88|economy|699|61,35|137|Substantivo|economia
88|fit|700|61,35|137|Verbo, Adjetivo|caber; servir; em forma
88|guy|701|61,33|136|Substantivo|cara, sujeito
88|function|702|61,32|135|Substantivo|função
88|yesterday|703|61,32|135|Advérbio|ontem
88|image|704|61,31|135|Substantivo|imagem
89|size|705|61,30|135|Substantivo|tamanho
89|behavior|706|61,30|135|Substantivo|comportamento
89|addition|707|61,30|135|Substantivo|adição (in addition = além disso)
89|determine|708|61,29|134|Verbo|determinar
89|station|709|61,28|134|Substantivo|estação
89|population|710|61,28|134|Substantivo|população
89|fail|711|61,27|134|Verbo|falhar; ser reprovado
89|environment|712|61,27|134|Substantivo|meio ambiente; ambiente
90|production|713|61,25|133|Substantivo|produção
90|contract|714|61,24|133|Substantivo|contrato
90|player|715|61,22|132|Substantivo|jogador
90|comment|716|61,22|132|Substantivo, Verbo|comentário; comentar
90|enter|717|61,21|132|Verbo|entrar; inserir
90|occur|718|61,20|132|Verbo|ocorrer
90|alone|719|61,20|132|Adjetivo, Advérbio|sozinho
90|significant|720|61,18|131|Adjetivo|significativo
91|drug|721|61,18|131|Substantivo|droga; medicamento
91|wall|722|61,17|131|Substantivo|parede; muro
91|series|723|61,17|131|Substantivo|série
91|direct|724|61,16|131|Adjetivo, Verbo|direto; dirigir
91|success|725|61,15|130|Substantivo|sucesso
91|tomorrow|726|61,14|130|Advérbio|amanhã
91|director|727|61,13|130|Substantivo|diretor
91|clearly|728|61,13|130|Advérbio|claramente
92|lack|729|61,12|129|Substantivo, Verbo|falta; carecer de
92|review|730|61,12|129|Substantivo, Verbo|revisão; avaliação; revisar
92|depend|731|61,10|129|Verbo|depender
92|race|732|61,10|129|Substantivo|corrida; raça
92|recognize|733|61,10|129|Verbo|reconhecer
92|window|734|61,10|129|Substantivo|janela
92|purpose|735|61,09|128|Substantivo|propósito, finalidade
92|department|736|61,09|128|Substantivo|departamento
93|gain|737|61,08|128|Verbo, Substantivo|ganhar; ganho
93|tree|738|61,08|128|Substantivo|árvore
93|college|739|61,07|128|Substantivo|faculdade
93|argue|740|61,07|128|Verbo|discutir; argumentar
93|board|741|61,06|128|Substantivo|quadro; conselho, diretoria; tábua
93|holiday|742|61,05|127|Substantivo|feriado; férias
93|mark|743|61,05|127|Substantivo, Verbo|marca; nota; marcar
93|church|744|61,02|127|Substantivo|igreja
94|machine|745|61,02|126|Substantivo|máquina
94|achieve|746|61,02|126|Verbo|alcançar, conseguir
94|item|747|61,02|126|Substantivo|item
94|prove|748|61,02|126|Verbo|provar
94|cent|749|61,02|126|Substantivo|centavo
94|season|750|61,01|126|Substantivo|estação (do ano); temporada
94|floor|751|61,01|126|Substantivo|chão; andar
94|stuff|752|61,01|126|Substantivo|coisas, troço
95|wide|753|61,01|126|Adjetivo|largo, amplo
95|anyone|754|61,01|126|Pronome|qualquer pessoa; ninguém (neg.)
95|method|755|61,01|126|Substantivo|método
95|analysis|756|61,00|126|Substantivo|análise
95|election|757|60,99|126|Substantivo|eleição
95|military|758|60,99|126|Adjetivo, Substantivo|militar; forças armadas
95|hotel|759|60,99|126|Substantivo|hotel
95|club|760|60,99|126|Substantivo|clube
96|below|761|60,99|126|Preposição, Advérbio|abaixo de
96|movie|762|60,99|126|Substantivo|filme
96|doctor|763|60,98|125|Substantivo|médico; doutor
96|discussion|764|60,98|125|Substantivo|discussão
96|sorry|765|60,98|125|Adjetivo|desculpe; arrependido
96|challenge|766|60,98|125|Substantivo, Verbo|desafio; desafiar
96|nation|767|60,96|125|Substantivo|nação
96|nearly|768|60,96|125|Advérbio|quase
97|statement|769|60,95|125|Substantivo|declaração; extrato
97|link|770|60,95|124|Substantivo, Verbo|link, ligação; ligar
97|despite|771|60,94|124|Preposição|apesar de
97|introduce|772|60,94|124|Verbo|apresentar; introduzir
97|advantage|773|60,94|124|Substantivo|vantagem
97|ready|774|60,94|124|Adjetivo|pronto
97|marry|775|60,93|124|Verbo|casar-se com
97|strike|776|60,93|124|Verbo, Substantivo|bater; atacar; greve
98|mile|777|60,92|124|Substantivo|milha
98|seek|778|60,92|123|Verbo|procurar, buscar
98|ability|779|60,90|123|Substantivo|capacidade, habilidade
98|unit|780|60,90|123|Substantivo|unidade
98|card|781|60,89|123|Substantivo|cartão; carta (baralho)
98|hospital|782|60,88|123|Substantivo|hospital
98|quickly|783|60,86|122|Advérbio|rapidamente
98|interview|784|60,86|122|Substantivo, Verbo|entrevista; entrevistar
99|agreement|785|60,85|122|Substantivo|acordo
99|release|786|60,85|122|Verbo, Substantivo|liberar; lançar; lançamento
99|tax|787|60,85|122|Substantivo|imposto
99|solution|788|60,85|122|Substantivo|solução
99|capital|789|60,83|121|Substantivo|capital
99|popular|790|60,82|121|Adjetivo|popular
99|specific|791|60,82|121|Adjetivo|específico
99|beautiful|792|60,82|121|Adjetivo|bonito, lindo
100|fear|793|60,81|121|Substantivo, Verbo|medo; temer
100|aim|794|60,81|121|Substantivo, Verbo|objetivo; visar, mirar
100|television|795|60,81|120|Substantivo|televisão
100|serious|796|60,81|120|Adjetivo|sério
100|target|797|60,80|120|Substantivo|alvo; meta
100|degree|798|60,78|120|Substantivo|grau; diploma
100|pull|799|60,77|120|Verbo|puxar
100|red|800|60,77|119|Adjetivo|vermelho
101|husband|801|60,77|119|Substantivo|marido
101|access|802|60,77|119|Substantivo, Verbo|acesso; acessar
101|movement|803|60,75|119|Substantivo|movimento
101|treat|804|60,74|119|Verbo, Substantivo|tratar; agrado, guloseima
101|identify|805|60,73|118|Verbo|identificar
101|loss|806|60,72|118|Substantivo|perda; prejuízo
101|shall|807|60,72|118|Verbo modal|(futuro formal); dever
101|modern|808|60,70|117|Adjetivo|moderno
102|pressure|809|60,70|117|Substantivo|pressão
102|bus|810|60,69|117|Substantivo|ônibus
102|treatment|811|60,69|117|Substantivo|tratamento
102|conference|812|60,68|117|Substantivo|conferência
102|yourself|813|60,67|117|Pronome|você mesmo; se
102|supply|814|60,66|116|Substantivo, Verbo|fornecimento; oferta; fornecer
102|village|815|60,65|116|Substantivo|vila, aldeia
102|worth|816|60,64|116|Adjetivo, Substantivo|que vale; valor
103|natural|817|60,64|116|Adjetivo|natural
103|express|818|60,64|116|Verbo, Adjetivo|expressar; expresso
103|indicate|819|60,64|116|Verbo|indicar
103|attend|820|60,63|116|Verbo|frequentar; comparecer
103|brother|821|60,63|116|Substantivo|irmão
103|investment|822|60,63|116|Substantivo|investimento
103|score|823|60,62|115|Substantivo, Verbo|pontuação, placar; marcar (ponto)
103|organize|824|60,62|115|Verbo|organizar
104|trip|825|60,62|115|Substantivo|viagem, passeio
104|beyond|826|60,62|115|Preposição|além de
104|sleep|827|60,61|115|Verbo, Substantivo|dormir; sono
104|fish|828|60,60|115|Substantivo, Verbo|peixe; pescar
104|promise|829|60,60|115|Verbo, Substantivo|prometer; promessa
104|potential|830|60,59|115|Adjetivo, Substantivo|potencial
104|energy|831|60,59|115|Substantivo|energia
104|trouble|832|60,59|115|Substantivo|problema; dificuldade
105|relation|833|60,58|114|Substantivo|relação
105|touch|834|60,56|114|Verbo, Substantivo|tocar; toque; contato
105|file|835|60,56|114|Substantivo, Verbo|arquivo; arquivar; protocolar
105|middle|836|60,56|114|Substantivo, Adjetivo|meio; do meio
105|bar|837|60,55|114|Substantivo|bar; barra
105|suffer|838|60,55|113|Verbo|sofrer
105|strategy|839|60,55|113|Substantivo|estratégia
105|deep|840|60,54|113|Adjetivo|profundo
106|except|841|60,54|113|Preposição|exceto
106|clean|842|60,54|113|Adjetivo, Verbo|limpo; limpar
106|tend|843|60,54|113|Verbo|tender a; cuidar de
106|advance|844|60,54|113|Substantivo, Verbo|avanço; adiantamento; avançar
106|fill|845|60,53|113|Verbo|encher; preencher
106|star|846|60,52|113|Substantivo|estrela
106|network|847|60,50|112|Substantivo|rede
106|generally|848|60,50|112|Advérbio|geralmente
107|operation|849|60,49|112|Substantivo|operação; cirurgia
107|match|850|60,47|111|Substantivo, Verbo|partida, jogo; fósforo; combinar com
107|avoid|851|60,47|111|Verbo|evitar
107|seat|852|60,45|111|Substantivo|assento, lugar
107|throw|853|60,45|111|Verbo|jogar, atirar
107|task|854|60,44|111|Substantivo|tarefa
107|normal|855|60,43|110|Adjetivo|normal
107|goal|856|60,42|110|Substantivo|objetivo, meta; gol
108|associate|857|60,42|110|Verbo, Substantivo|associar; sócio
108|blue|858|60,41|110|Adjetivo|azul
108|positive|859|60,40|110|Adjetivo|positivo
108|option|860|60,40|110|Substantivo|opção
108|box|861|60,39|109|Substantivo|caixa
108|huge|862|60,39|109|Adjetivo|enorme
108|message|863|60,39|109|Substantivo|mensagem
108|instance|864|60,38|109|Substantivo|exemplo, caso (for instance = por exemplo)
109|style|865|60,38|109|Substantivo|estilo
109|refer|866|60,37|109|Verbo|referir-se; encaminhar
109|cold|867|60,36|109|Adjetivo, Substantivo|frio; resfriado
109|push|868|60,36|109|Verbo|empurrar
109|quarter|869|60,36|109|Substantivo|quarto (1/4); trimestre
109|assume|870|60,34|108|Verbo|supor; assumir
109|baby|871|60,33|108|Substantivo|bebê
109|successful|872|60,32|108|Adjetivo|bem-sucedido
110|sing|873|60,32|108|Verbo|cantar
110|doubt|874|60,32|108|Substantivo, Verbo|dúvida; duvidar
110|competition|875|60,32|108|Substantivo|competição; concorrência
110|theory|876|60,31|108|Substantivo|teoria
110|propose|877|60,31|107|Verbo|propor
110|reference|878|60,30|107|Substantivo|referência
110|argument|879|60,30|107|Substantivo|argumento; discussão
110|adult|880|60,30|107|Substantivo, Adjetivo|adulto
111|fly|881|60,30|107|Verbo, Substantivo|voar; mosca
111|document|882|60,29|107|Substantivo|documento
111|pattern|883|60,29|107|Substantivo|padrão
111|application|884|60,28|107|Substantivo|aplicação; candidatura; aplicativo
111|hot|885|60,28|107|Adjetivo|quente
111|obviously|886|60,28|107|Advérbio|obviamente
111|unclear|887|60,27|106|Adjetivo|pouco claro, incerto
111|bill|888|60,27|106|Substantivo|conta (a pagar); projeto de lei; nota (dinheiro)
112|search|889|60,26|106|Verbo, Substantivo|procurar; busca
112|separate|890|60,26|106|Adjetivo, Verbo|separado; separar
112|central|891|60,26|106|Adjetivo|central
112|career|892|60,25|106|Substantivo|carreira
112|anyway|893|60,25|106|Advérbio|de qualquer forma
112|speech|894|60,24|106|Substantivo|discurso; fala
112|dog|895|60,24|106|Substantivo|cachorro
112|officer|896|60,24|106|Substantivo|oficial; policial
113|throughout|897|60,24|106|Preposição|durante todo; por todo
113|oil|898|60,22|105|Substantivo|óleo; petróleo
113|dress|899|60,21|105|Substantivo, Verbo|vestido; vestir(-se)
113|profit|900|60,21|105|Substantivo|lucro
113|guess|901|60,20|105|Verbo, Substantivo|adivinhar; achar; palpite
113|fun|902|60,20|105|Substantivo, Adjetivo|diversão; divertido
113|protect|903|60,20|105|Verbo|proteger
113|resource|904|60,19|105|Substantivo|recurso
114|science|905|60,19|104|Substantivo|ciência
114|disease|906|60,19|104|Substantivo|doença
114|balance|907|60,18|104|Substantivo, Verbo|equilíbrio; saldo; equilibrar
114|damage|908|60,18|104|Substantivo, Verbo|dano; danificar
114|basis|909|60,18|104|Substantivo|base
114|author|910|60,17|104|Substantivo|autor
114|basic|911|60,17|104|Adjetivo|básico
114|encourage|912|60,16|104|Verbo|incentivar, encorajar
115|hair|913|60,15|104|Substantivo|cabelo
115|male|914|60,15|103|Adjetivo, Substantivo|masculino; macho
115|operate|915|60,14|103|Verbo|operar; funcionar
115|reflect|916|60,14|103|Verbo|refletir
115|exercise|917|60,13|103|Substantivo, Verbo|exercício; exercitar
115|useful|918|60,12|103|Adjetivo|útil
115|restaurant|919|60,12|103|Substantivo|restaurante
115|income|920|60,12|103|Substantivo|renda, rendimento
116|property|921|60,12|103|Substantivo|propriedade; imóvel
116|previous|922|60,12|103|Adjetivo|anterior
116|dark|923|60,11|103|Adjetivo|escuro
116|imagine|924|60,11|102|Verbo|imaginar
116|okay|925|60,10|102|Adjetivo, Interjeição|ok; tudo bem
116|earn|926|60,09|102|Verbo|ganhar (dinheiro); merecer
116|daughter|927|60,09|102|Substantivo|filha
116|post|928|60,08|102|Substantivo, Verbo|correio; cargo; postagem; publicar
117|newspaper|929|60,07|102|Substantivo|jornal
117|define|930|60,06|101|Verbo|definir
117|conclusion|931|60,05|101|Substantivo|conclusão
117|clock|932|60,05|101|Substantivo|relógio
117|everybody|933|60,05|101|Pronome|todo mundo
117|weekend|934|60,04|101|Substantivo|fim de semana
117|perform|935|60,04|101|Verbo|realizar; apresentar-se
117|professional|936|60,04|101|Adjetivo, Substantivo|profissional
118|mine|937|60,04|101|Pronome, Substantivo|meu, minha; mina
118|debate|938|60,03|101|Substantivo, Verbo|debate; debater
118|memory|939|60,03|101|Substantivo|memória; lembrança
118|green|940|60,03|101|Adjetivo|verde
118|song|941|60,02|101|Substantivo|música, canção
118|object|942|60,00|100|Substantivo, Verbo|objeto; objetar
118|maintain|943|60,00|100|Verbo|manter
118|credit|944|59,99|100|Substantivo|crédito
119|ring|945|59,99|100|Substantivo, Verbo|anel; tocar (campainha)
119|discover|946|59,97|99|Verbo|descobrir
119|dead|947|59,96|99|Adjetivo|morto
119|afternoon|948|59,96|99|Substantivo|tarde
119|prefer|949|59,96|99|Verbo|preferir
119|extend|950|59,95|99|Verbo|estender, prorrogar
119|possibility|951|59,95|99|Substantivo|possibilidade
119|direction|952|59,94|99|Substantivo|direção
120|facility|953|59,94|99|Substantivo|instalação; facilidade
120|variety|954|59,92|98|Substantivo|variedade
120|daily|955|59,91|98|Adjetivo, Advérbio|diário; diariamente
120|clothes|956|59,91|98|Substantivo|roupas
120|screen|957|59,90|98|Substantivo|tela
120|track|958|59,89|98|Substantivo, Verbo|trilha; pista; faixa; rastrear
120|dance|959|59,89|97|Verbo, Substantivo|dançar; dança
120|completely|960|59,89|97|Advérbio|completamente
121|female|961|59,88|97|Adjetivo, Substantivo|feminino; fêmea
121|responsibility|962|59,88|97|Substantivo|responsabilidade
121|original|963|59,84|96|Adjetivo|original
121|sister|964|59,84|96|Substantivo|irmã
121|rock|965|59,84|96|Substantivo|pedra, rocha; rock
121|dream|966|59,84|96|Substantivo, Verbo|sonho; sonhar
121|nor|967|59,82|96|Conjunção|nem
121|university|968|59,82|96|Substantivo|universidade
122|easily|969|59,81|96|Advérbio|facilmente
122|agency|970|59,81|96|Substantivo|agência
122|dollar|971|59,80|96|Substantivo|dólar
122|garden|972|59,79|95|Substantivo|jardim
122|fix|973|59,79|95|Verbo|consertar; fixar
122|ahead|974|59,78|95|Advérbio|à frente
122|cross|975|59,78|95|Verbo, Substantivo|atravessar; cruz
122|yeah|976|59,77|95|Advérbio|é; sim (informal)
123|candidate|977|59,74|94|Substantivo|candidato
123|weight|978|59,74|94|Substantivo|peso
123|legal|979|59,72|94|Adjetivo|legal, jurídico
123|proposal|980|59,71|94|Substantivo|proposta
123|version|981|59,71|94|Substantivo|versão
123|conversation|982|59,71|93|Substantivo|conversa
123|somebody|983|59,70|93|Pronome|alguém
123|pound|984|59,69|93|Substantivo|libra
124|magazine|985|59,69|93|Substantivo|revista
124|shape|986|59,69|93|Substantivo, Verbo|forma; formato; moldar
124|sea|987|59,68|93|Substantivo|mar
124|immediately|988|59,67|93|Advérbio|imediatamente
124|welcome|989|59,67|93|Adjetivo, Verbo|bem-vindo; dar boas-vindas
124|smile|990|59,67|93|Substantivo, Verbo|sorriso; sorrir
124|communication|991|59,67|93|Substantivo|com comunicação
124|agent|992|59,65|92|Substantivo|agente
125|traditional|993|59,65|92|Adjetivo|tradicional
125|replace|994|59,64|92|Verbo|substituir
125|judge|995|59,64|92|Substantivo, Verbo|juiz; julgar
125|herself|996|59,63|92|Pronome|ela mesma; se
125|suddenly|997|59,63|92|Advérbio|de repente
125|generation|998|59,63|92|Substantivo|geração
125|estimate|999|59,63|92|Verbo, Substantivo|estimar; estimativa
125|favorite|1000|59,62|92|Adjetivo|favorito
126|difficulty|1001|59,62|92|Substantivo|dificuldade
126|purchase|1002|59,61|91|Substantivo, Verbo|compra; comprar
126|shoot|1003|59,60|91|Verbo|atirar; filmar
126|announce|1004|59,60|91|Verbo|anunciar
126|unless|1005|59,60|91|Conjunção|a menos que
126|independent|1006|59,59|91|Adjetivo|independente
126|recommend|1007|59,58|91|Verbo|recomendar
126|survey|1008|59,58|91|Substantivo|pesquisa (levantamento)
127|majority|1009|59,58|91|Substantivo|maioria
127|stick|1010|59,57|91|Verbo, Substantivo|grudar; manter-se; vara
127|request|1011|59,56|90|Substantivo, Verbo|pedido; solicitar
127|rich|1012|59,54|90|Adjetivo|rico
127|wind|1013|59,54|90|Substantivo|vento
127|none|1014|59,53|90|Pronome|nenhum
127|exchange|1015|59,52|90|Substantivo, Verbo|troca; câmbio; trocar
127|budget|1016|59,51|89|Substantivo|orçamento
128|famous|1017|59,51|89|Adjetivo|famoso
128|blood|1018|59,51|89|Substantivo|sangue
128|appropriate|1019|59,51|89|Adjetivo|apropriado
128|block|1020|59,51|89|Substantivo, Verbo|bloco; quarteirão; bloquear
128|warm|1021|59,50|89|Adjetivo|morno, quente; caloroso
128|count|1022|59,50|89|Verbo|contar
128|scene|1023|59,50|89|Substantivo|cena
128|writer|1024|59,49|89|Substantivo|escritor
129|content|1025|59,49|89|Substantivo|conteúdo
129|prevent|1026|59,48|89|Verbo|impedir, prevenir
129|safe|1027|59,47|89|Adjetivo|seguro
129|invite|1028|59,47|88|Verbo|convidar
129|mix|1029|59,46|88|Verbo, Substantivo|misturar; mistura
129|element|1030|59,45|88|Substantivo|elemento
129|effective|1031|59,45|88|Adjetivo|eficaz
129|correct|1032|59,45|88|Adjetivo, Verbo|correto; corrigir
130|medical|1033|59,43|88|Adjetivo|médico
130|admit|1034|59,42|88|Verbo|admitir
130|beat|1035|59,42|87|Verbo|bater; vencer
130|telephone|1036|59,42|87|Substantivo|telefone
130|copy|1037|59,41|87|Substantivo, Verbo|cópia; copiar
130|committee|1038|59,40|87|Substantivo|comitê
130|aware|1039|59,40|87|Adjetivo|ciente, consciente
130|advice|1040|59,40|87|Substantivo|conselho
131|handle|1041|59,39|87|Verbo, Substantivo|lidar com; maçaneta, alça
131|glass|1042|59,39|87|Substantivo|vidro; copo
131|trial|1043|59,38|87|Substantivo|julgamento; teste
131|stress|1044|59,38|87|Substantivo|estresse; ênfase
131|radio|1045|59,37|86|Substantivo|rádio
131|administration|1046|59,36|86|Substantivo|administração
131|complex|1047|59,36|86|Adjetivo|complexo
131|text|1048|59,35|86|Substantivo|texto
132|context|1049|59,35|86|Substantivo|contexto
132|ride|1050|59,34|86|Verbo, Substantivo|andar (de carro, bicicleta, cavalo); passeio
132|directly|1051|59,34|86|Advérbio|diretamente
132|heavy|1052|59,34|86|Adjetivo|pesado
132|remove|1053|59,33|86|Verbo|remover
132|conduct|1054|59,33|86|Verbo, Substantivo|conduzir, realizar; conduta
132|equipment|1055|59,33|86|Substantivo|equipamento
132|otherwise|1056|59,33|86|Advérbio|caso contrário
133|title|1057|59,32|86|Substantivo|título
133|extra|1058|59,31|85|Adjetivo|extra
133|executive|1059|59,31|85|Substantivo, Adjetivo|executivo
133|chair|1060|59,31|85|Substantivo|cadeira
133|expensive|1061|59,31|85|Adjetivo|caro
133|sample|1062|59,30|85|Substantivo|amostra
133|sex|1063|59,30|85|Substantivo|sexo
133|deliver|1064|59,29|85|Verbo|entregar
134|video|1065|59,29|85|Substantivo|vídeo
134|connection|1066|59,29|85|Substantivo|conexão
134|primary|1067|59,28|85|Adjetivo|primário; principal
134|weather|1068|59,27|85|Substantivo|tempo (clima)
134|collect|1069|59,27|84|Verbo|coletar; colecionar; buscar
134|inform|1070|59,25|84|Verbo|informar
134|principle|1071|59,25|84|Substantivo|princípio
134|straight|1072|59,24|84|Adjetivo, Advérbio|reto; direto
135|appeal|1073|59,24|84|Substantivo, Verbo|apelo; recurso; apelar; atrair
135|highly|1074|59,24|84|Advérbio|altamente
135|trust|1075|59,24|84|Substantivo, Verbo|confiança; confiar
135|wonderful|1076|59,23|84|Adjetivo|maravilhoso
135|flat|1077|59,23|84|Adjetivo, Substantivo|plano; apartamento (UK)
135|absolutely|1078|59,22|84|Advérbio|absolutamente
135|flow|1079|59,22|84|Substantivo, Verbo|fluxo; fluir
135|fair|1080|59,22|84|Adjetivo, Substantivo|justo; feira
136|additional|1081|59,21|83|Adjetivo|adicional
136|responsible|1082|59,21|83|Adjetivo|responsável
136|farm|1083|59,20|83|Substantivo|fazenda
136|collection|1084|59,20|83|Substantivo|coleção; cobrança
136|hang|1085|59,19|83|Verbo|pendurar
136|negative|1086|59,18|83|Adjetivo|negativo
136|band|1087|59,18|83|Substantivo|banda
136|relative|1088|59,17|83|Substantivo, Adjetivo|parente; relativo
137|tour|1089|59,17|83|Substantivo|passeio; turnê
137|alternative|1090|59,17|83|Substantivo, Adjetivo|alternativa
137|software|1091|59,17|83|Substantivo|software
137|pair|1092|59,16|82|Substantivo|par
137|ship|1093|59,16|82|Substantivo, Verbo|navio; enviar
137|attitude|1094|59,14|82|Substantivo|atitude
137|cheap|1095|59,14|82|Adjetivo|barato
137|double|1096|59,14|82|Adjetivo, Verbo|duplo; dobrar
138|leg|1097|59,13|82|Substantivo|perna
138|observe|1098|59,13|82|Verbo|observar
138|sentence|1099|59,13|82|Substantivo|frase; sentença
138|print|1100|59,12|82|Verbo|imprimir
138|progress|1101|59,12|82|Substantivo|progresso
138|truth|1102|59,11|82|Substantivo|verdade
138|nobody|1103|59,11|82|Pronome|ninguém
138|examine|1104|59,10|81|Verbo|examinar
139|lay|1105|59,10|81|Verbo|colocar, deitar (algo)
139|speed|1106|59,09|81|Substantivo|velocidade
139|politics|1107|59,09|81|Substantivo|política
139|reply|1108|59,08|81|Verbo, Substantivo|responder; resposta
139|display|1109|59,08|81|Verbo, Substantivo|exibir; tela, exibição
139|transfer|1110|59,08|81|Substantivo, Verbo|transferência; transferir
139|perfect|1111|59,07|81|Adjetivo|perfeito
139|slightly|1112|59,07|81|Advérbio|ligeiramente
140|overall|1113|59,07|81|Adjetivo, Advérbio|geral; no geral
140|intend|1114|59,06|80|Verbo|pretender
140|user|1115|59,05|80|Substantivo|usuário
140|respond|1116|59,05|80|Verbo|responder
140|dinner|1117|59,04|80|Substantivo|jantar
140|slow|1118|59,04|80|Adjetivo|lento
140|regular|1119|59,04|80|Adjetivo|regular
140|physical|1120|59,04|80|Adjetivo|físico
141|apart|1121|59,02|80|Advérbio|separado; à parte
141|suit|1122|59,01|80|Substantivo, Verbo|terno; ação judicial; servir, convir
141|federal|1123|59,01|80|Adjetivo|federal
141|reveal|1124|59,01|80|Verbo|revelar
141|percentage|1125|59,00|79|Substantivo|porcentagem
141|peace|1126|58,99|79|Substantivo|paz
141|status|1127|58,99|79|Substantivo|situação; status
141|crime|1128|58,98|79|Substantivo|crime
142|decline|1129|58,97|79|Verbo, Substantivo|diminuir; recusar; declínio
142|decade|1130|58,97|79|Substantivo|década
142|launch|1131|58,97|79|Verbo, Substantivo|lançar; lançamento
142|warn|1132|58,96|79|Verbo|avisar, alertar
142|consumer|1133|58,96|79|Substantivo|consumidor
142|favor|1134|58,96|79|Substantivo|favor
142|dry|1135|58,95|78|Adjetivo, Verbo|seco; secar
142|partner|1136|58,95|78|Substantivo|parceiro; sócio
143|institution|1137|58,95|78|Substantivo|instituição
143|spot|1138|58,94|78|Substantivo, Verbo|lugar; mancha; avistar
143|horse|1139|58,94|78|Substantivo|cavalo
143|eventually|1140|58,93|78|Advérbio|finalmente, por fim
143|heat|1141|58,93|78|Substantivo|calor
143|excite|1142|58,92|78|Verbo|entusiasmar, empolgar
143|reader|1143|58,92|78|Substantivo|leitor
143|importance|1144|58,91|78|Substantivo|importância
144|distance|1145|58,90|78|Substantivo|distância
144|guide|1146|58,90|78|Substantivo, Verbo|guia; guiar
144|grant|1147|58,90|78|Verbo, Substantivo|conceder; subsídio, bolsa
144|taxi|1148|58,89|77|Substantivo|táxi
144|feed|1149|58,89|77|Verbo|alimentar
144|pain|1150|58,89|77|Substantivo|dor
144|sector|1151|58,87|77|Substantivo|setor
144|mistake|1152|58,87|77|Substantivo|erro
145|ensure|1153|58,86|77|Verbo|garantir
145|satisfy|1154|58,85|77|Verbo|satisfazer
145|chief|1155|58,85|77|Substantivo, Adjetivo|chefe; principal
145|cool|1156|58,85|77|Adjetivo|fresco; legal (gíria)
145|expert|1157|58,84|77|Substantivo|especialista
145|wave|1158|58,84|77|Substantivo, Verbo|onda; acenar
145|south|1159|58,84|77|Substantivo|sul
145|labor|1160|58,83|76|Substantivo|trabalho; mão de obra
146|surface|1161|58,83|76|Substantivo|superfície
146|library|1162|58,82|76|Substantivo|biblioteca
146|excellent|1163|58,81|76|Adjetivo|excelente
146|edge|1164|58,81|76|Substantivo|borda, beira
146|camp|1165|58,81|76|Substantivo|acampamento
146|audience|1166|58,80|76|Substantivo|públicic, plateia
146|lift|1167|58,80|76|Verbo, Substantivo|levantar; elevador (UK); carona
146|procedure|1168|58,79|76|Substantivo|procedimento
147|email|1169|58,79|76|Substantivo|e-mail
147|global|1170|58,79|76|Adjetivo|global
147|struggle|1171|58,79|76|Verbo, Substantivo|lutar, esforçar-se; luta
147|advertise|1172|58,77|75|Verbo|anunciar, fazer propaganda
147|select|1173|58,76|75|Verbo|selecionar
147|surround|1174|58,75|75|Verbo|cercar, rodear
147|extent|1175|58,74|75|Substantivo|extensão, grau
147|river|1176|58,73|75|Substantivo|rio
148|annual|1177|58,73|75|Adjetivo|anual
148|fully|1178|58,73|75|Advérbio|totalmente
148|contrast|1179|58,72|75|Substantivo|contraste
148|roll|1180|58,71|74|Verbo, Substantivo|rolar; rolo
148|reality|1181|58,71|74|Substantivo|realidade
148|photograph|1182|58,70|74|Substantivo|fotografia
148|artist|1183|58,69|74|Substantivo|artista
148|conflict|1184|58,69|74|Substantivo|conflito
149|entire|1185|58,69|74|Adjetivo|inteiro
149|presence|1186|58,69|74|Substantivo|presença
149|crowd|1187|58,69|74|Substantivo|multidão
149|corner|1188|58,69|74|Substantivo|canto; esquina
149|gas|1189|58,69|74|Substantivo|gás; gasolina (EUA)
149|shift|1190|58,68|74|Substantivo, Verbo|turno; mudança; mudar
149|net|1191|58,68|74|Adjetivo, Substantivo|líquido (valor); rede
149|category|1192|58,68|74|Substantivo|categoria
150|secretary|1193|58,68|74|Substantivo|secretário
150|defense|1194|58,68|74|Substantivo|defesa
150|quick|1195|58,67|74|Adjetivo|rápido
150|cook|1196|58,67|74|Verbo, Substantivo|cozinhar; cozinheiro
150|spread|1197|58,66|73|Verbo|espalhar
150|nuclear|1198|58,66|73|Adjetivo|nuclear
150|scale|1199|58,66|73|Substantivo|escala; balança
150|driver|1200|58,66|73|Substantivo|motorista
151|ball|1201|58,65|73|Substantivo|bola; baile
151|cry|1202|58,64|73|Verbo|chorar; gritar
151|introduction|1203|58,63|73|Substantivo|introdução; apresentação
151|requirement|1204|58,63|73|Substantivo|requisito, exigência
151|north|1205|58,62|73|Substantivo|norte
151|confirm|1206|58,62|73|Verbo|confirmar
151|senior|1207|58,60|72|Adjetivo, Substantivo|sênior; idoso; superior
151|photo|1208|58,59|72|Substantivo|foto
152|refuse|1209|58,59|72|Verbo|recusar
152|transport|1210|58,58|72|Substantivo, Verbo|transporte; transportar
152|emerge|1211|58,58|72|Verbo|surgir, emergir
152|map|1212|58,58|72|Substantivo|mapa
152|concept|1213|58,58|72|Substantivo|conceito
152|island|1214|58,57|72|Substantivo|ilha
152|reform|1215|58,57|72|Substantivo, Verbo|reforma; reformar
152|neither|1216|58,57|72|Pronome, Conjunção|nenhum (dos dois); nem
153|football|1217|58,56|72|Substantivo|futebol; futebol americano (EUA)
153|survive|1218|58,56|72|Verbo|sobreviver
153|flight|1219|58,55|72|Substantivo|voo
153|left|1220|58,55|72|Adjetivo, Substantivo|esquerdo; esquerda
153|solve|1221|58,54|72|Verbo|resolver
153|neighbor|1222|58,54|72|Substantivo|vizinho
153|background|1223|58,54|71|Substantivo|fundo; formação, histórico
153|technique|1224|58,54|71|Substantivo|técnica
154|traffic|1225|58,54|71|Substantivo|trânsito
154|improvement|1226|58,53|71|Substantivo|melhoria
154|tool|1227|58,52|71|Substantivo|ferramenta
154|consequence|1228|58,52|71|Substantivo|consequência
154|circumstance|1229|58,52|71|Substantivo|circunstância
154|smoke|1230|58,52|71|Substantivo, Verbo|fumaça; fumar
154|reaction|1231|58,52|71|Substantivo|reação
154|rain|1232|58,52|71|Substantivo, Verbo|chuva; chover
155|busy|1233|58,51|71|Adjetivo|ocupado
155|lesson|1234|58,51|71|Substantivo|lição; aula
155|brain|1235|58,50|71|Substantivo|cérebro
155|mass|1236|58,50|71|Substantivo|massa
155|funny|1237|58,49|71|Adjetivo|engraçado
155|contribute|1238|58,49|71|Verbo|contribuir
155|failure|1239|58,49|71|Substantivo|fracasso; falha
155|schedule|1240|58,48|71|Substantivo, Verbo|agenda, cronograma; agendar
156|speaker|1241|58,48|70|Substantivo|palestrante; alto-falante
156|bottom|1242|58,47|70|Substantivo|fundo; parte de baixo
156|adopt|1243|58,47|70|Verbo|adotar
156|combine|1244|58,47|70|Verbo|combinar
156|mountain|1245|58,46|70|Substantivo|montanha
156|waste|1246|58,46|70|Substantivo, Verbo|desperdício; lixo; desperdiçar
156|hide|1247|58,45|70|Verbo|esconder
156|marriage|1248|58,45|70|Substantivo|casamento
157|ticket|1249|58,45|70|Substantivo|ingresso; passagem; multa
157|meal|1250|58,45|70|Substantivo|refeição
157|colleague|1251|58,45|70|Substantivo|colega (de trabalho)
157|bag|1252|58,45|70|Substantivo|bolsa; sacola
157|repeat|1253|58,44|70|Verbo|repetir
157|equal|1254|58,43|70|Adjetivo|igual
157|expression|1255|58,43|70|Substantivo|expressão
157|plus|1256|58,43|70|Preposição|mais
158|extremely|1257|58,43|70|Advérbio|extremamente
158|owner|1258|58,42|70|Substantivo|dono, proprietário
158|plane|1259|58,42|69|Substantivo|avião; plano
158|commercial|1260|58,41|69|Adjetivo, Substantivo|comercial
158|lady|1261|58,39|69|Substantivo|senhora, dama
158|duty|1262|58,38|69|Substantivo|dever; tarifa (alfandegária)
158|strength|1263|58,37|69|Substantivo|força
158|connect|1264|58,36|69|Verbo|conectar
159|cultural|1265|58,36|69|Adjetivo|cultural
159|arrange|1266|58,35|68|Verbo|organizar, arranjar
159|scheme|1267|58,35|68|Substantivo|esquema; plano
159|payment|1268|58,34|68|Substantivo|pagamento
159|unfortunately|1269|58,34|68|Advérbio|infelizmente
159|brief|1270|58,34|68|Adjetivo|breve
159|bird|1271|58,33|68|Substantivo|pássaro, ave
159|demonstrate|1272|58,33|68|Verbo|demonstrar
160|contribution|1273|58,33|68|Substantivo|contribuição
160|appreciate|1274|58,32|68|Verbo|apreciar; agradecer
160|chapter|1275|58,32|68|Substantivo|capítulo
160|secret|1276|58,32|68|Substantivo, Adjetivo|segredo; secreto
160|apparently|1277|58,32|68|Advérbio|aparentemente
160|novel|1278|58,32|68|Substantivo, Adjetivo|romance (livro); inovador
160|union|1279|58,31|68|Substantivo|sindicato; união
160|burn|1280|58,31|68|Verbo|queimar
161|trend|1281|58,31|68|Substantivo|tendência
161|initial|1282|58,31|68|Adjetivo|inicial
161|pleasure|1283|58,30|68|Substantivo|prazer
161|suggestion|1284|58,30|68|Substantivo|sugestão
161|critical|1285|58,29|67|Adjetivo|crítico
161|gather|1286|58,29|67|Verbo|reunir, juntar
161|mostly|1287|58,29|67|Advérbio|principalmente
161|earth|1288|58,29|67|Substantivo|terra; Terra
162|pop|1289|58,28|67|Verbo, Substantivo|estourar; aparecer; música pop
162|essential|1290|58,27|67|Adjetivo|essencial
162|desire|1291|58,27|67|Substantivo, Verbo|desejo; desejar
162|promote|1292|58,27|67|Verbo|promover
162|currently|1293|58,27|67|Advérbio|atualmente
162|employ|1294|58,26|67|Verbo|empregar
162|path|1295|58,26|67|Substantivo|caminho
162|topic|1296|58,26|67|Substantivo|tópico, assunto
163|beach|1297|58,25|67|Substantivo|praia
163|attract|1298|58,25|67|Verbo|atrair
163|engage|1299|58,25|67|Verbo|envolver(-se); engajar
163|powerful|1300|58,24|67|Adjetivo|poderoso
163|flower|1301|58,24|67|Substantivo|flor
163|crisis|1302|58,24|67|Substantivo|crise
163|settle|1303|58,23|67|Verbo|resolver, acertar; estabelecer-se
163|boat|1304|58,23|66|Substantivo|barco
164|aid|1305|58,23|66|Substantivo|ajuda, auxílio
164|fan|1306|58,23|66|Substantivo|fã; ventilador
164|kitchen|1307|58,23|66|Substantivo|cozinha
164|twice|1308|58,22|66|Advérbio|duas vezes
164|fresh|1309|58,22|66|Adjetivo|fresco
164|delay|1310|58,22|66|Substantivo, Verbo|atraso; atrasar
164|safety|1311|58,22|66|Substantivo|segurança
164|engineer|1312|58,22|66|Substantivo|engenheiro
165|quiet|1313|58,21|66|Adjetivo|quieto, silencioso
165|insurance|1314|58,21|66|Substantivo|seguro
165|nurse|1315|58,21|66|Substantivo|enfermeiro
165|divide|1316|58,20|66|Verbo|dividir
165|length|1317|58,20|66|Substantivo|comprimento
165|investigation|1318|58,19|66|Substantivo|investigação
165|package|1319|58,19|66|Substantivo|pacote
165|somewhere|1320|58,19|66|Advérbio|em algum lugar
166|expand|1321|58,18|66|Verbo|expandir
166|commit|1322|58,18|66|Verbo|cometer; comprometer-se
166|obvious|1323|58,18|66|Adjetivo|óbvio
166|jump|1324|58,16|65|Verbo|pular
166|weapon|1325|58,16|65|Substantivo|arma
166|relatively|1326|58,15|65|Advérbio|relativamente
166|host|1327|58,15|65|Substantivo, Verbo|anfitrião; apresentador; sediar
166|winter|1328|58,15|65|Substantivo|inverno
167|district|1329|58,15|65|Substantivo|distrito, bairro
167|broad|1330|58,14|65|Adjetivo|amplo, largo
167|tire|1331|58,12|65|Verbo, Substantivo|cansar; pneu
167|spring|1332|58,11|65|Substantivo|primavera; mola; nascente
167|spirit|1333|58,09|64|Substantivo|espírito
167|lunch|1334|58,09|64|Substantivo|almoço
167|actual|1335|58,08|64|Adjetivo|real, efetivo
167|pool|1336|58,08|64|Substantivo|piscina
168|battle|1337|58,08|64|Substantivo|batalha
168|tradition|1338|58,08|64|Substantivo|tradição
168|cash|1339|58,07|64|Substantivo|dinheiro (em espécie)
168|hardly|1340|58,06|64|Advérbio|mal; quase não
168|award|1341|58,06|64|Substantivo, Verbo|prêmio; premiar
168|coach|1342|58,06|64|Substantivo|treinador; ônibus de viagem
168|experiment|1343|58,06|64|Substantivo|experimento
168|consideration|1344|58,06|64|Substantivo|consideração
169|strange|1345|58,06|64|Adjetivo|estranho
169|code|1346|58,06|64|Substantivo|código
169|possibly|1347|58,04|64|Advérbio|possivelmente
169|threat|1348|58,04|64|Substantivo|ameaça
169|accident|1349|58,04|64|Substantivo|acidente
169|impossible|1350|58,04|64|Adjetivo|impossível
169|revenue|1351|58,04|64|Substantivo|receita (faturamento)
169|enable|1352|58,04|64|Verbo|permitir, possibilitar
170|afraid|1353|58,03|63|Adjetivo|com medo
170|active|1354|58,03|63|Adjetivo|ativo
170|conclude|1355|58,02|63|Verbo|concluir
170|religious|1356|58,01|63|Adjetivo|religioso
170|cancer|1357|58,01|63|Substantivo|câncer
170|convince|1358|58,01|63|Verbo|convencer
170|vary|1359|58,01|63|Verbo|variar
170|environmental|1360|58,00|63|Adjetivo|ambiental
171|sun|1361|58,00|63|Substantivo|sol
171|healthy|1362|57,99|63|Adjetivo|saudável
171|blow|1363|57,98|63|Verbo, Substantivo|soprar; golpe
171|volume|1364|57,97|63|Substantivo|volume
171|location|1365|57,97|63|Substantivo|localização, local
171|invest|1366|57,97|63|Verbo|investir
171|proceed|1367|57,97|63|Verbo|prosseguir
171|wash|1368|57,97|63|Verbo|lavar
172|actor|1369|57,96|63|Substantivo|ator
172|glad|1370|57,96|63|Adjetivo|contente
172|tape|1371|57,96|62|Substantivo|fita
172|whereas|1372|57,96|62|Conjunção|enquanto (contraste), ao passo que
172|opposite|1373|57,95|62|Adjetivo, Substantivo|oposto; em frente
172|stone|1374|57,95|62|Substantivo|pedra
172|sum|1375|57,95|62|Substantivo|soma; quantia
172|murder|1376|57,95|62|Substantivo, Verbo|assassinato; assassinar
173|monitor|1377|57,94|62|Substantivo, Verbo|monitor; monitorar
173|soldier|1378|57,94|62|Substantivo|soldado
173|finance|1379|57,94|62|Substantivo, Verbo|finanças; financiar
173|hate|1380|57,93|62|Verbo|odiar
173|egg|1381|57,93|62|Substantivo|ovo
173|concert|1382|57,92|62|Substantivo|show, concerto
173|shock|1383|57,92|62|Substantivo, Verbo|choque; chocar
173|comfortable|1384|57,92|62|Adjetivo|confortável
174|usual|1385|57,92|62|Adjetivo|habitual, de costume
174|carefully|1386|57,91|62|Advérbio|cuidadosamente
174|pack|1387|57,91|62|Verbo, Substantivo|fazer as malas; embalar; pacote
174|recall|1388|57,91|62|Verbo|lembrar; fazer recall
174|wine|1389|57,90|62|Substantivo|vinho
174|camera|1390|57,90|62|Substantivo|câmera
174|swim|1391|57,90|62|Verbo|nadar
174|manufacture|1392|57,90|62|Verbo|fabricar
175|theater|1393|57,89|61|Substantivo|teatro
175|cycle|1394|57,88|61|Substantivo|ciclo
175|coffee|1395|57,87|61|Substantivo|café
175|totally|1396|57,87|61|Advérbio|totalmente
175|museum|1397|57,87|61|Substantivo|museu
175|visitor|1398|57,87|61|Substantivo|visitante
175|freedom|1399|57,86|61|Substantivo|liberdade
175|construction|1400|57,86|61|Substantivo|construção
`
