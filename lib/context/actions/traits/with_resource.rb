module LB
  module WithResource
    def resource
      payload[:resource].to_sym
    end
  end
end
