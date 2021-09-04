const puppeteer = require('puppeteer'); 

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://grid.com.ar');
  await page.screenshot({ path: 'example.jpg' });

// busqueda de una clase de productos. 
  await page.type('.fulltext-search-box' , 'Zapatillas Jordan');
  await page.screenshot({ path: 'busqueda.jpg' });
  await page.click('.btn-buscar');
  await page.screenshot({path: 'busquedaC.jpg'});

  await page.waitForSelector('.prateleira');
  await page.waitForTimeout(3000);
  await page.screenshot({path: 'gridBusqueda.jpg'}); 


  //Obtencion de links 
  const links = await page.evaluate(()=>{
        const productos = document.querySelectorAll('.product-name a');
        const linkP = [];

        for(let element of productos){
            linkP.push(element.href);
        }
        return linkP;
  });
  // numero de links obtenidos. 
  console.log(links.length);

  //Abrir cada enlace y esperar al titulo. 

  for(let enlace of links){
      await page.goto(enlace);
      await page.waitForTimeout(1000);
      
      const jordan = [];
      const imgA = {};
      
     const shoes = await page.evaluate(()=>{
         const zapatillas = {};
         
         
         zapatillas.id = document.querySelector('.productReference ').innerText;
         zapatillas.title = document.querySelector('.fn').innerText;
         zapatillas.gender = document.querySelector('.grid-producto-genero').innerText;
         zapatillas.img = document.querySelector('#image-main').src;

         if(document.querySelector('.skuBestPrice') ){
          zapatillas.price = document.querySelector('.skuBestPrice').innerText;
         } else{
          zapatillas.price = 'no disponible';
         };

         if(document.querySelector('.value-field.Color')){
            zapatillas.color = document.querySelector('.value-field.Color').innerText
         }else{
             zapatillas.color = 'No disponible';
         };

         if(document.querySelector('.value-field.Marca')){
           zapatillas.marca = document.querySelector('.value-field.Marca').innerText;
         }else{
           zapatillas.marca = 'No disponible';
         };
         

       

           
       return zapatillas;
      });
      shoes.url = enlace;

      
      jordan.push(shoes);
      console.log(jordan); //jordan
  }



  
  

  await browser.close();
})();