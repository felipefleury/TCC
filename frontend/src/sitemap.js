export const sitemap = [
    {name:"Home", url:"/", icon:"home"},
    {name:"Produtos", url:"/produtos", icon:"list"},
   {name:"Carrinho", url:"/carrinho", icon:"shopping_cart"},
   {name:"Estoque 1", url:"/estoque", icon:"storage"},
   {name:"Estoque 2", url:"/estoque", icon:"storage", roles:['fornecedor']},
   {name:"admin", url:"/admin", icon:"settings", roles:['admin']},
]