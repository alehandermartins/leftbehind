module LB
  module WithResource
    def resource
      payload[:resource].to_sym
    end

    def resource_capacity res
    	capacity = {
        food: 2,
        helmet: 2,
        parts: 3,
        energy: 3
      }
      capacity[res]
    end
  end
end
