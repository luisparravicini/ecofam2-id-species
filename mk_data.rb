#!/usr/bin/env ruby -W

require 'csv'
require 'json'

SKIP_NAME = '_SKIP_'.freeze

def remove_unneeded_cols(file_data)
  cols_to_remove = []
  file_data[0].each_with_index do |col, index|
    cols_to_remove << index if col&.strip == SKIP_NAME
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

  key = File.basename(path)
            .downcase
            .gsub(/^.+-/, '')
            .gsub(/\.csv$/, '')
            .gsub(/í/, 'i')
            .strip
            .gsub(/\W/, '_')

  remove_unneeded_cols(file_data)
  data[key] = { headers: file_data[0], data: file_data[1..-1] }
end

birds_keys = ['color_pico_4', 'color_pico_2', 'patas', 'picos', 'alas']

birds_species = []
birds_keys.each do |key|
  birds_species += data[key][:headers]
end
birds_species = birds_species
  .compact
  .uniq
  .sort
birds_species.delete_if { |x| x.strip.empty? }

mammal_species = []
mammal_species = data.values
  .map { |x| x[:headers] }
  .flatten
  .compact
  .uniq
  .sort
mammal_species.delete_if { |x| x.strip.empty? }
mammal_species.delete_if { |x| birds_species.include?(x.strip) }

# $stderr.puts data.inspect

data.each do |k, v|
  species = if birds_keys.include?(k)
    birds_species
  else
    mammal_species
  end

  values = v[:data].map do |value_row|
    [value_row.first] + species.map do |name|
      index = v[:headers].index(name)
      new_data = nil
      new_data = value_row[index] unless index.nil?

      new_data
    end
  end

  data[k] = values
end

# $stderr.puts data.inspect

puts <<-EOT
/*
 * No editar manualmente, archivo autogenerado por #{File.basename($0)}
 */
EOT

# no es exactamente json lo que quiero genera pero *deberia* funcionar
species_names = mammal_species.to_json
puts "let mammalSpecies = #{species_names}";
species_names = birds_species.to_json
puts "let birdSpecies = #{species_names}";

puts <<-EOT
let data = {
EOT

data.each do |k, v|
  puts "\t#{k}: {"

  puts "\t\tdata: ["
  v.each_with_index do |row, index|
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

puts '}'
