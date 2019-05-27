#!/usr/bin/env ruby -W


require 'csv'

data = CSV.parse(IO.read('Clave dicotómica mamíferos marinos - Sheet1.csv'))


print "\t\tthis.species = ["
print data[0][1..-1].map { |x| "\"#{x}\"" }.join(', ')
puts "\t\t];"

puts "\t\tthis.data = ["
data[1..-1].each do |row|
	jsrow = []
	jsrow << "\"#{row[0]}\""
	jsrow += row[1..-1].map { |x| x == '1' }

	puts "\t\t\t[%s]," % jsrow.join(', ')
end
puts "];"
