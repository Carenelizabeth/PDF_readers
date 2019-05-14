// node script.js

const pdfjs = require('pdfjs-dist');
const Fuzzeset = require('fuzzyset.js');

// match tax-id first
// fuzzy name match as secondary

// a = fuzzeset();
// ["Bob Loblaw", "Barb Loboaw", "Bobby LobLobby"].forEach(x => a.add(x));
// const result = a.get("Mr Bob J Loblaw Jr");
// console.log(result);

// pdfjs.getDocument('multiple_eins.pdf').then(pdf => {
// pdfjs.getDocument('ein_test.pdf').then(pdf => {
// pdfjs.getDocument('pdf_reference_1-7.pdf').then(pdf => {
// pdfjs.getDocument('Nascar Plaza Holdings - Scott Azaroff - 2018 K1.pdf').then(pdf => {
//   console.log(pdf.numPages)
//   pdf.getPage(1).then(page => {
//     // https://www.codeproject.com/Articles/466362/Blend-PDF-with-HTML
//     page.getAnnotations().then(x => {
//       // rect(distance from left and bot):
//       // [ left, bottom ,right, top ]
//       console.log(x.filter(x => x.fieldValue));
//       // console.log(x.map(x => x.fieldValue).join('\n'));
//     })
// //     page.getTextContent().then(text => {
// //       const fullText = text.items.map(x => x.str).join('\n');
// //       // console.log(`----------\n${fullText}\n----------`);
// //       const x = FuzzySet();
// //       text.items.forEach(item => x.add(item.str));
// //       const searchString = "pdf ref";
// //       // console.log(fullText)
// //       // console.log(`search: '${searchString}'`)
// //       // console.log(x.get(searchString))
// //     });
//   }).catch(e => console.log(`error: ${e}`));
// }).catch(e => console.log(`error: ${e}`));

// console.log(getAllText(url3))

// function getAllText(pdfUrl){
//   const patternEIN = /\d{2}\-?\d{7}/g;
//   const patternTID = /\d{9}/g
//   const patternSSN = /\d{3}[\-?]\d{2}[\-?]\d{4}/g
//   const tax_numbers = {}

//   let pdf = pdfjs.getDocument(pdfUrl);
//   return pdf.then(pdf => {
//     const pagePromises = [];
//     for (let i=1; i<pdf.numPages+1; i++){
//       let page = pdf.getPage(i)
//       pagePromises.push(page.then(page =>{
//         let textContent = page.getTextContent()
//         return textContent.then(text =>
//           text.items.map(x => x.str).join(' '));
//       }))
//     }
//       Promise.all(pagePromises).then(allText => {
//       tax_numbers.tax_id = allText.join(' ').match(patternSSN);
//       tax_numbers.ein_id = allText.join(' ').match(patternEIN);
//       tax_numbers.tin_id = allText.join(' ').match(patternTID);
//       console.log(tax_numbers);
//       return tax_numbers;
//     })
//   }
//   ).catch(e => console.log(`error ${e}`))
// }

// // console.log(getIds(url2));

// async function getIds(pdfUrl){

//   try{
//       await pdfjs.getDocument(pdfUrl)
//       .then(function(pdf){
//         const pagePromises = [];
//         for (let i=1; i<pdf.numPages+1; i++){
//           let page = pdf.getPage(i)
//           pagePromises.push(page.then(page =>{
//             let textContent = page.getTextContent()
//             return textContent.then(text =>
//               text.items.map(x => x.str).join(' '));
//           }))
//           console.log(pagePromises)
//         }
//         Promise.all(pagePromises).then(text => console.log(text))
//       }
//   )}
//   catch(err){
//     console.log(err)
//   }
// }

url1 = 'Nascar Plaza Holdings - Scott Azaroff - 2018 K1.pdf'
url2 = 'pdf_reference_1-7.pdf'
url3 = 'ein_test.pdf'
url4 = 'multiple_eins.pdf'
url5 = 'brook.pdf'
url6 = 'non_matcher.pdf'

getTaxIds(url1);
getTaxIds(url2);
getTaxIds(url3);
getTaxIds(url4);
getTaxIds(url5);
getTaxIds(url6);

async function getTaxIds(pdfUrl){
  const patternSSN = /\d{3}[\-?]\d{2}[\-?]\d{4}/g
  const patternEIN = /\d{2}\-?\d{7}/g;
  const patternTIN = /\d{9}/g
  const tax_numbers = {}

  let fullText = await getFullText(pdfUrl)
  let allAnnotations = await getAllAnnotations(pdfUrl)

  tax_numbers.tax_id = extractTaxIds(fullText, allAnnotations, patternSSN)
  tax_numbers.ein_id = extractTaxIds(fullText, allAnnotations, patternEIN)
  tax_numbers.tin_id = extractTaxIds(fullText, allAnnotations, patternTIN)

  console.log(pdfUrl, tax_numbers);
}

function extractTaxIds(text, annotations, pattern){

  const tids = []
  arr1 = text.match(pattern)
  arr2 = annotations.match(pattern)

  if(arr1 !==null){tids.push(...arr1)}
  if(arr2 !==null){tids.push(...arr2)}

  return([...new Set(tids)])
}

async function getFullText(pdfUrl){
  const pdf = await pdfjs.getDocument(pdfUrl).promise
  const maxPages = pdf.numPages;
  const pagePromises = [];
  for (let i=1; i<=maxPages; i++){
    pagePromises.push(getPageText(pdf, i))
  }
  const pageText = await Promise.all(pagePromises)
  return pageText.join(' ');
}

async function getPageText(pdf, pageNumber){
  const page = await pdf.getPage(pageNumber);
  const text = await page.getTextContent();
  const pageText = text.items.map(x => x.str).join(' ')
  return pageText;
}

async function getAllAnnotations(pdfUrl){
  const pdf = await pdfjs.getDocument(pdfUrl).promise
  const maxPages = pdf.numPages;
  const pagePromises = [];
  for (let i=1; i<=maxPages; i++){
    pagePromises.push(getPageAnnotations(pdf, i))
  }
  const allAnnotations = await Promise.all(pagePromises)
  return allAnnotations.join(' ');
}

async function getPageAnnotations(pdf, pageNumber){
  const page = await pdf.getPage(pageNumber);
  const a = await page.getAnnotations()
  const pageAnnotations = a.filter(a => a.fieldValue).map(a => a.fieldValue).join(' ')
  return pageAnnotations
}
