# python script.py

# pip install PyPDF2
import PyPDF2

print("PyPDF2")
# open(file, mode) r=read, b=binary
# pdfFileObj = open('pdf_reference_1-7.pdf', 'rb')
pdfFileObj = open('Nascar Plaza Holdings - Scott Azaroff - 2018 K1.pdf', 'rb')
pdfReader = PyPDF2.PdfFileReader(pdfFileObj)

# https://pythonhosted.org/PyPDF2/PageObject.html
text = pdfReader.getPage(0).extractText()
fields = pdfReader.getFields()
textFields = pdfReader.getFormTextFields()
print([x for x in textFields.values() if x is not None])
