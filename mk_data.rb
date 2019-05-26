#!/usr/bin/env ruby -W


require 'csv'

data = CSV.parse(IO.read('Clave dicotómica mamíferos marinos - Sheet1.csv'))


print "let species = ["
print data[0][1..-1].map { |x| "\"#{x}\"" }.join(', ')
puts "];"

puts "let data = ["
data[1..-1].each do |row|
	jsrow = []
	jsrow << "\"#{row[0]}\""
	jsrow += row[1..-1].map { |x| x == '1' }

	puts '[%s],' % jsrow.join(', ')
end
puts "];"
