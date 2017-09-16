module LB
  module Located
    def location
      payload[:location]
    end

    def location_inventory
      @context.locations[location][:inventory]
    end

    def flattened_inventory
      location_inventory.reduce([]) do |acc, amounts|
        acc + ([amounts.first] * amounts.last)
      end
    end
  end
end
