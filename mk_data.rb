#!/usr/bin/env ruby -W


require 'csv'


SKIP_NAME = '_SKIP_'


def remove_unneeded_cols(file_data)
	cols_to_remove = []
	file_data[0].each_with_index do |col, index|
		if col&.strip == SKIP_NAME
			cols_to_remove << index
		end
	end
	cols_to_remove.reverse.each do |index|
		file_data.each do |row|
			row.delete_at(index)
		end
	end
end

data = {}
Dir.glob(File.join('csv', '*.csv')).each do |path|

	file_data = CSV.parse(IO.read(path))

	key = File.basename(path).downcase.
		gsub(/^.+-/, '').
		gsub(/\.csv$/, '').
		strip.
		gsub(/\W/, '_')


	remove_unneeded_cols(file_data)
	data[key] = { headers: file_data[0], data: file_data[1..-1] }
end


puts <<-EOT
/*
 * No editar manualmente, archivo autogenerado por #{File.basename($0)}
 */

let data = {
EOT

data.each do |k, v|
	puts "\t#{k}: {"

	print "\t\tspecies: ["
	print v[:headers][1..-1].map { |x| "\"#{x}\"" }.join(', ')
	puts "],"

	puts "\t\tdata: ["
	v[:data].each_with_index do |row, index|
		name = row[0]&.strip
		next if name.nil? || name.empty?

		jsrow = []
		jsrow << "\"#{name}\""
		jsrow += row[1..-1].map { |x| x == '1' }

		puts "\t\t\t[%s]," % jsrow.join(', ')
	end
	puts "\t\t],"

	puts "\t},"
end

puts "}"
