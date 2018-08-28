
const axios = require("axios");
const baseURL = 'https://mqggl9cika.execute-api.us-east-2.amazonaws.com/dev/';

axios.baseURL = baseURL;

let fornecedor1 = {
  "username": "fornecedor1",
  "password": "123",
  "id":"c9996726-6214-4308-865a-d9f8b31e67e9",
  "nome": "Distribuidora ABC",
  "role": "fornecedor"
}
let fornecedor2 = {
  "username": "fornecedor2",
  "password": "123",
  "id":"ec3abff2-2181-46ba-9478-7815af31fbaf",
  "nome": "Distribuidora XPTO",
  "role": "fornecedor"
}

axios.post(baseURL + 'users', fornecedor1).then(data => {
  console.log(data);
  fornecedor1 = data;
}).catch(err => {
  console.log(err);
})
axios.post(baseURL + 'users', fornecedor2).then(data => {
  console.log(data);
  fornecedor2 = data;
}).catch(err => {
  console.log(err);
})

produtos = [{
    "descricao": "Para o ciclista que procura uma bicicleta que transmite estabilidade e segurança em sua trilha.", 
    "detalhes": "Aventure-se em MTB e cross-country com conforto e desempenho: Quadro com geometria XC, transmissão shimano, rodas Cross Ride e suspensão de 100 mm.", 
    "nome": "BICICLETA MOUNTAIN BIKE ARO 29 CALOI ATACAMA", 
    "id": "0263e370-a962-11e8-92a2-894f229c38d1",  
    "preco": 2367.90,  
    "categoria": "esporte",
    "fotoUrl": "https://i1-decathlon.a8e.net.br/gm/bicicleta-mountain-bike-aro-29-caloi-atacama_159630702_2309127.jpg",
    "subcategoria":"ciclismo"
  },{
    "descricao": "Desenvolvido para os treinos regulares e a iniciação para competições de Cross-country (XC).",
    "detalhes": "Aventure-se em MTB e cross-country com conforto e desempenho: Quadro com geometria XC, nova transmissão SRAM NX monoprato 1X11, rodas MAVIC Cross Ride FTS-X e suspensão MANITOU M30 Air 100 mm.", 
    "nome": "BICICLETA MOUNTAIN BIKE ARO 27,5 ROCKRIDER 900 BTWIN", 
    "id": "776909c1-3702-4b39-9e4b-fbbde3022fb9",  
    "preco": 4367.90,  
    "categoria": "esporte",
    "fotoUrl": "https://i4-decathlon.a8e.net.br/gm/bicicleta-mountain-bike-aro-27-5-rockrider-900-btwin_161747119_2087628.jpg",
    "subcategoria":"ciclismo"
},{
    "descricao": "Desenvolvido para a prática regular de ciclismo na estrada.",
    "detalhes": "Uma bicicleta eficaz para a prática regular de ciclismo de estrada. Novo quadro em alumínio 6061 muito polivalente e com garfo carbono e novo grupo SHIMANO SORA triplo 27 velocidades.", 
    "nome": "BICICLETA DE ESTRADA TRIBAN 520 BTWIN", 
    "id": "586598b2-cb3a-4851-afbe-5c65126b4504",  
    "preco": 4367.90,  
    "categoria": "esporte",
    "fotoUrl": "https://i1-decathlon.a8e.net.br/gm/bicicleta-de-estrada-triban-520-btwin_157873836_2163633.jpg",
    "subcategoria":"ciclismo"
  },{
    "detalhes":"O capacete de mtb ST 500 tem espumas interiores confortáveis, 21 ventilações e ao botão rotativo de ajuste. Cumpre a norma EN 1078 relativa aos capacetes.",
    "descricao": "Para o ciclista que procura um capacete essencial.", 
    "nome": "CAPACETE DE CICLISMO 500 BTWIN", 
    "id": "da1e758f-d00a-481e-adc5-1c8c4294c22d",  
    "preco": 167.90,  
    "categoria": "esporte",
    "fotoUrl": "https://i4-decathlon.a8e.net.br/gm/capacete-bicicleta-500-feminino-preto_76095287_585179.jpg",
    "subcategoria":"ciclismo"
  },{
    "detalhes":"A Camiseta de Corrida Kalenji Ekiden conta com a tecnologia Equarea, que permite a eliminação da transpiração e mantém o corpo seco durante a corrida.",
    "descricao": "Camiseta de Corrida Kalenji Ekiden com a tecnologia Equarea", 
    "nome": "CAMISETA MASCULINA DE CORRIDA EKIDEN KALENJI", 
    "id": "4b68583f-764a-42cf-9b34-63847d716e5f",  
    "preco": 14.90,  
    "categoria": "esporte",
    "fotoUrl": "https://i2-decathlon.a8e.net.br/gm/camiseta-de-corrida-ekiden-kalenji-masculina_79732668_536391.jpg",
    "subcategoria":"corrida"
  },{
    "detalhes":"A Camiseta de Corrida Kalenji Ekiden conta com a tecnologia Equarea, que permite a eliminação da transpiração e mantém o corpo seco durante a corrida.",
    "descricao": "Camiseta de Corrida Kalenji Ekiden com a tecnologia Equarea", 
    "nome": "CAMISETA MASCULINA DE CORRIDA EKIDEN KALENJI", 
    "id": "b9e302f7-9760-43a2-a93e-50b4341cc02a",  
    "preco": 14.90,  
    "categoria": "esporte",
    "fotoUrl": "https://i5-decathlon.a8e.net.br/gm/t-shirt-de-corrida-ekiden-masculina-azul_78932716_581615.jpg",
    "subcategoria":"corrida"
  },{
    "detalhes":"A Camiseta de Corrida Kalenji Ekiden conta com a tecnologia Equarea, que permite a eliminação da transpiração e mantém o corpo seco durante a corrida.",
    "descricao": "Camiseta de Corrida Kalenji Ekiden com a tecnologia Equarea", 
    "nome": "CAMISETA MASCULINA DE CORRIDA EKIDEN KALENJI", 
    "id": "e9252b39-1a84-4c90-b41b-5dc03e19def5",  
    "preco": 14.90,  
    "categoria": "esporte",
    "fotoUrl": "https://i2-decathlon.a8e.net.br/gm/camiseta-de-corrida-ekiden-kalenji-masculina_79733596_2014704.jpg",
    "subcategoria":"corrida"
  },{
    "detalhes":"A Camiseta de Corrida Kalenji Ekiden conta com a tecnologia Equarea, que permite a eliminação da transpiração e mantém o corpo seco durante a corrida.",
    "descricao": "Camiseta de Corrida Kalenji Ekiden com a tecnologia Equarea", 
    "nome": "CAMISETA MASCULINA DE CORRIDA EKIDEN KALENJI", 
    "id": "1b0a2c95-e51a-4b34-a855-dbbbc893fb41",  
    "preco": 14.90,  
    "categoria": "esporte",
    "fotoUrl": "https://i3-decathlon.a8e.net.br/gm/camiseta-masculina-de-corrida-run-dry-kalenji_165631449_2501406.jpg",
    "subcategoria":"corrida"
  },{
    "detalhes":"A Camiseta de Corrida Kalenji Ekiden conta com a tecnologia Equarea, que permite a eliminação da transpiração e mantém o corpo seco durante a corrida.",
    "descricao": "Camiseta de Corrida Kalenji Ekiden com a tecnologia Equarea", 
    "nome": "CAMISETA MASCULINA DE CORRIDA EKIDEN KALENJI", 
    "id": "730353ae-7f37-4327-968c-7824b2fe51ea",  
    "preco": 14.90,  
    "categoria": "esporte",
    "fotoUrl": "https://i1-decathlon.a8e.net.br/gm/camiseta-masculina-de-corrida-run-dry-kalenji_165631385_2501420.jpg",
    "subcategoria":"corrida"
  }
];

let url = "https://mqggl9cika.execute-api.us-east-2.amazonaws.com/dev/";

let estoques = []

let estoques2 = []

for (var i = 0; i < produtos.length; i++) {
    estoques[estoques.length] = { idProduto: produtos[i].id, quantidade: (i + 4)};
    estoques2[estoques2.length] = { idProduto: produtos[i].id, quantidade: (20 - (i + 4))};
    axios.put(url + "produtos/" + produtos[i].id, produtos[i]).then(data => {
        console.log("Produtos inseridos!");
    }
    ).catch(err => {
    console.log(err.response.data.error) ;
  
    })
}
console.log(JSON.stringify(estoques));
axios.post(url + "fornecedores/c9996726-6214-4308-865a-d9f8b31e67e9/estoque", estoques).then(data => {
  console.log("Estoque inserido!");
}
).catch(err => {
console.log(err.response.data.error) ;
});
axios.post(url + "fornecedores/ec3abff2-2181-46ba-9478-7815af31fbaf/estoque", estoques2).then(data => {
  console.log("Estoque inserido!");
}
).catch(err => {
console.log(err.response.data.error) ;
});


