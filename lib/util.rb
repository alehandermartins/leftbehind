module Util
	class << self
  	def string_keyed_hash_to_symbolized hash, nest = true
      hash.map do |k,v|
        next if k == '_id'
        next [k,v] unless k.is_a? String
        next [k.to_sym, string_keyed_hash_to_symbolized(v)] if v.is_a? Hash
        next [k.to_sym, symbolize_array(v)] if v.is_a? Array
        [k.to_sym, v]
      end.compact.to_h
    end

    def symbolize_array array
      return array unless array.all?{ |element| element.is_a? Hash}
      array.map{ |element|
        element.map{ |k, v|
          next [k.to_sym, symbolize_array(v)] if v.is_a? Array
          [k.to_sym, v]
        }.to_h
      }
    end
  end
end
