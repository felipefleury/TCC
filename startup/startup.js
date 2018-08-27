
const axios = require("axios");
const baseURL = 'https://mqggl9cika.execute-api.us-east-2.amazonaws.com/dev/';

axios.baseURL = baseURL;

produtos = [{
    "descricao": "Para o ciclista que procura uma bicicleta que transmite estabilidade e segurança em sua trilha.", 
    "detalhes": "Aventure-se em MTB e cross-country com conforto e desempenho: Quadro com geometria XC, transmissão shimano, rodas Cross Ride e suspensão de 100 mm.", 
    "nome": "BICICLETA MOUNTAIN BIKE ARO 29 CALOI ATACAMA", 
    "codigo": "2309120",  
    "preco": 2367.90,  
    "categoria": "esporte",
    "fotoUrl": "https://i1-decathlon.a8e.net.br/gm/bicicleta-mountain-bike-aro-29-caloi-atacama_159630702_2309127.jpg",
    "subcategoria":"ciclismo"
  },{
    "descricao": "Desenvolvido para os treinos regulares e a iniciação para competições de Cross-country (XC).",
    "detalhes": "Aventure-se em MTB e cross-country com conforto e desempenho: Quadro com geometria XC, nova transmissão SRAM NX monoprato 1X11, rodas MAVIC Cross Ride FTS-X e suspensão MANITOU M30 Air 100 mm.", 
    "nome": "BICICLETA MOUNTAIN BIKE ARO 27,5 ROCKRIDER 900 BTWIN", 
    "codigo": "3349121",  
    "preco": 4367.90,  
    "categoria": "esporte",
    "fotoUrl": "https://i4-decathlon.a8e.net.br/gm/bicicleta-mountain-bike-aro-27-5-rockrider-900-btwin_161747119_2087628.jpg",
    "subcategoria":"ciclismo"
},{
    "descricao": "Desenvolvido para a prática regular de ciclismo na estrada.",
    "detalhes": "Uma bicicleta eficaz para a prática regular de ciclismo de estrada. Novo quadro em alumínio 6061 muito polivalente e com garfo carbono e novo grupo SHIMANO SORA triplo 27 velocidades.", 
    "nome": "BICICLETA DE ESTRADA TRIBAN 520 BTWIN", 
    "codigo": "4349121",  
    "preco": 4367.90,  
    "categoria": "esporte",
    "fotoUrl": "https://i1-decathlon.a8e.net.br/gm/bicicleta-de-estrada-triban-520-btwin_157873836_2163633.jpg",
    "subcategoria":"ciclismo"
  },{
    "detalhes":"O capacete de mtb ST 500 tem espumas interiores confortáveis, 21 ventilações e ao botão rotativo de ajuste. Cumpre a norma EN 1078 relativa aos capacetes.",
    "descricao": "Para o ciclista que procura um capacete essencial.", 
    "nome": "CAPACETE DE CICLISMO 500 BTWIN", 
    "codigo": "1309122",  
    "preco": 167.90,  
    "categoria": "esporte",
    "fotoUrl": "https://i4-decathlon.a8e.net.br/gm/capacete-bicicleta-500-feminino-preto_76095287_585179.jpg",
    "subcategoria":"ciclismo"
  },{
    "descricao": "Para o ciclista que procura uma bicicleta que transmite estabilidade e segurança em sua trilha.", 
    "nome": "BICICLETA MOUNTAIN BIKE ARO 29 CALOI ATACAMA", 
    "codigo": "2309123",  
    "preco": 2367.90,  
    "categoria": "esporte",
    "fotoUrl": "https://i1-decathlon.a8e.net.br/gm/bicicleta-mountain-bike-aro-29-caloi-atacama_159630702_2309127.jpg",
    "subcategoria":"ciclismo"
  },{
    "descricao": "Para o ciclista que procura uma bicicleta que transmite estabilidade e segurança em sua trilha.", 
    "nome": "BICICLETA MOUNTAIN BIKE ARO 29 CALOI ATACAMA", 
    "codigo": "2309124",  
    "preco": 2367.90,  
    "categoria": "esporte",
    "fotoUrl": "https://i1-decathlon.a8e.net.br/gm/bicicleta-mountain-bike-aro-29-caloi-atacama_159630702_2309127.jpg",
    "subcategoria":"ciclismo"
  },{
    "descricao": "Para o ciclista que procura uma bicicleta que transmite estabilidade e segurança em sua trilha.", 
    "nome": "BICICLETA MOUNTAIN BIKE ARO 29 CALOI ATACAMA", 
    "codigo": "2309125",  
    "preco": 2367.90,  
    "categoria": "esporte",
    "fotoUrl": "https://i1-decathlon.a8e.net.br/gm/bicicleta-mountain-bike-aro-29-caloi-atacama_159630702_2309127.jpg",
    "subcategoria":"ciclismo"
  },{
    "descricao": "Para o ciclista que procura uma bicicleta que transmite estabilidade e segurança em sua trilha.", 
    "nome": "BICICLETA MOUNTAIN BIKE ARO 29 CALOI ATACAMA", 
    "codigo": "2309126",  
    "preco": 2367.90,  
    "categoria": "esporte",
    "fotoUrl": "https://i1-decathlon.a8e.net.br/gm/bicicleta-mountain-bike-aro-29-caloi-atacama_159630702_2309127.jpg",
    "subcategoria":"ciclismo"
  },{
    "descricao": "Para o ciclista que procura uma bicicleta que transmite estabilidade e segurança em sua trilha.", 
    "nome": "BICICLETA MOUNTAIN BIKE ARO 29 CALOI ATACAMA", 
    "codigo": "2309127",  
    "preco": 2367.90,  
    "categoria": "esporte",
    "fotoUrl": "https://i1-decathlon.a8e.net.br/gm/bicicleta-mountain-bike-aro-29-caloi-atacama_159630702_2309127.jpg",
    "subcategoria":"ciclismo"
  },{
    "descricao": "Para o ciclista que procura uma bicicleta que transmite estabilidade e segurança em sua trilha.", 
    "nome": "BICICLETA MOUNTAIN BIKE ARO 29 CALOI ATACAMA", 
    "codigo": "2309128",  
    "preco": 2367.90,  
    "categoria": "esporte",
    "fotoUrl": "https://i1-decathlon.a8e.net.br/gm/bicicleta-mountain-bike-aro-29-caloi-atacama_159630702_2309127.jpg",
    "subcategoria":"ciclismo"
  },{
    "descricao": "Para o ciclista que procura uma bicicleta que transmite estabilidade e segurança em sua trilha.", 
    "nome": "BICICLETA MOUNTAIN BIKE ARO 29 CALOI ATACAMA", 
    "codigo": "2309129",  
    "preco": 2367.90,  
    "categoria": "esporte",
    "fotoUrl": "https://i1-decathlon.a8e.net.br/gm/bicicleta-mountain-bike-aro-29-caloi-atacama_159630702_2309127.jpg",
    "subcategoria":"ciclismo"
  },{
    "descricao": "Para o ciclista que procura uma bicicleta que transmite estabilidade e segurança em sua trilha.", 
    "nome": "BICICLETA MOUNTAIN BIKE ARO 29 CALOI ATACAMA", 
    "codigo": "2309130",  
    "preco": 2367.90,  
    "categoria": "esporte",
    "fotoUrl": "https://i1-decathlon.a8e.net.br/gm/bicicleta-mountain-bike-aro-29-caloi-atacama_159630702_2309127.jpg",
    "subcategoria":"ciclismo"
  }
];

let url = "https://mqggl9cika.execute-api.us-east-2.amazonaws.com/dev/produtos";
for (var i = 0; i < produtos.length; i++) {
    axios.post(url, produtos[i]).then(data => {
        console.log("Produtos inseridos!");
    }
    ).catch(err => {
    console.log(err.response.data.error) ;
    
    })
}

