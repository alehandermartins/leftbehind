module LB
  module WithItem
    def item
      payload[:item]
    end

    def price
      @context.items[item][:parts]
    end

    def selections
      payload[:selections]
    end

    def fix amount = 1
      @context.items[item][:fix] -= amount unless fixed?
    end

    def fixed?
      fixing_left == 0
    end

    private
      def fixing_left
        @context.items[item][:fix]
      end
  end
end
