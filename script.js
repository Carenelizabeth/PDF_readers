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
//       console.log(x.filter(x => x.fieldValue).map(x => ({ value: x.fieldValue, position: x.rect }) ));
//       // console.log(x.map(x => x.fieldValue).join('\n'));
//     })
//     page.getTextContent().then(text => {
//       const fullText = text.items.map(x => x.str).join('\n');
//       // console.log(`----------\n${fullText}\n----------`);
//       const x = FuzzySet();
//       text.items.forEach(item => x.add(item.str));
//       const searchString = "pdf ref";
//       // console.log(fullText)
//       // console.log(`search: '${searchString}'`)
//       // console.log(x.get(searchString))
//     });
//   }).catch(e => console.log(`error: ${e}`));
// }).catch(e => console.log(`error: ${e}`));

url1 = 'Nascar Plaza Holdings - Scott Azaroff - 2018 K1.pdf'
url2 = 'pdf_reference_1-7.pdf'
url3 = 'ein_test.pdf'
url4 = 'multiple_eins.pdf'
url5 = 'brook.pdf'
url6 = 'non_matcher.pdf'

getAllTest(url1)

function getAllTest(pdfUrl){
  const patternEIN = /\d{2}\-?\d{7}/g;
  const patternTID = /\d{9}/g
  const patternSSN = /\d{3}[\-?]\d{2}[\-?]\d{4}/g
  const tax_numbers = {}

  let pdf = pdfjs.getDocument(pdfUrl);
  return pdf.then(pdf => {
    const pagePromises = [];
    for (let i=1; i<pdf.numPages+1; i++){
      let page = pdf.getPage(i)
      pagePromises.push(page.then(page =>{
        let textContent = page.getTextContent()
        return textContent.then(text =>
          text.items.map(x => x.str).join(' '));
      }))
    }
    return Promise.all(pagePromises).then(allText => {

      tax_numbers.tax_id = allText.join(' ').match(patternSSN);
      tax_numbers.ein_id = allText.join(' ').match(patternEIN);
      tax_numbers.tin_id = allText.join(' ').match(patternTID);
      console.log(tax_numbers)
    })
  }).catch(e => console.log(`error ${e}`))
}

// const string = 'PTPA0312L   08/31/18 * -6,382. 82-4200697 STADIUM TERRACE INVESTORS 2483 N CANYON RD SUITE 200 PROVO, UT 84604 E-FILE 55-4821295 MAROAN STADIUM 150 LLC 3212 SHADOWBROOK DR PROVO, UT 84604 X X PARTNERSHIP 1.069748 1.069748 1.069748 1.069748 1.134044 1.134044 AA 349. AB 81,289. 56,964. AG 6,958. Z -6,382. 0. 50,000. -6,382. 43,618. X X PARTNER 20 Schedule K-1'
// const patternEIN = /\d{2}\-?\d{7}/g;

// let found = string.match(patternEIN)
// console.log(found);