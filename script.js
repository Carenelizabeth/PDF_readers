// node script.js

const pdfjs = require('pdfjs-dist');
const Fuzzeset = require('fuzzyset.js');

// match tax-id first
// fuzzy name match as secondary

// a = fuzzeset();
// ["Bob Loblaw", "Barb Loboaw", "Bobby LobLobby"].forEach(x => a.add(x));
// const result = a.get("Mr Bob J Loblaw Jr");
// console.log(result);

// pdfjs.getDocument('pdf_reference_1-7.pdf').then(pdf => {
pdfjs.getDocument('Nascar Plaza Holdings - Scott Azaroff - 2018 K1.pdf').then(pdf => {
  pdf.getPage(1).then(page => {
    // https://www.codeproject.com/Articles/466362/Blend-PDF-with-HTML
    page.getAnnotations().then(x => {
      // rect(distance from left and bot):
      // [ left, bottom ,right, top ]
      console.log(x.filter(x => x.fieldValue).map(x => ({ value: x.fieldValue, position: x.rect }) ));
      // console.log(x.map(x => x.fieldValue).join('\n'));
    })
    page.getTextContent().then(text => {
      const fullText = text.items.map(x => x.str).join('\n');
      // console.log(`----------\n${fullText}\n----------`);
      const x = FuzzySet();
      text.items.forEach(item => x.add(item.str));
      const searchString = "pdf ref";
      console.log(fullText)
      console.log(`search: '${searchString}'`)
      console.log(x.get(searchString))
    });
  }).catch(e => console.log(`error: ${e}`));
}).catch(e => console.log(`error: ${e}`));
