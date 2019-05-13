# ruby script.rb

# gem install pdf-reader
require("pdf-reader")

# reader = PDF::Reader.new("pdf_reference_1-7.pdf")
reader = PDF::Reader.new("Nascar Plaza Holdings - Scott Azaroff - 2018 K1.pdf")
puts reader.pages.map { |x| x.text }.join("\n")
