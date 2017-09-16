module LB
  module Action
    class Base < Struct.new 'Action', :performer, :slot, :payload

      def ensure_context ctx
        @context ||= ctx
      end

      def run context
        @context = context
      end

      def resolve context
        @context = context
      end

      def result
        @result
      end

      def status
        @result[:status]
      end

      def bounty
        @result[:bounty]
      end

      def info
        @result[:info]
      end

      def add_status new_status
        @result = @result || {}
        @result[:status] = new_status
      end

      def add_bounty new_bounty
        @result = @result || {}
        @result[:bounty] = new_bounty
      end

      def add_info message
        @result = @result || {}
        @result[:info] = @result[:info] || {}
        @result[:info].merge! message
      end

      def information action, inventory = nil
        inventory = performer.inventory.to_h.dup if inventory
        return {
          action: action,
          payload: payload,
          result: result,
          inventory: inventory
        }
      end

      def computed?
        !@result.nil?
      end

      def success?
        computed? && @result[:status] == :success
      end

      def resolved?
        computed? && (result[:status] == :resolved || result[:status] == :fail)
      end

      def to_h
        super.merge({
          result: result,
          type: self.class
        })
      end
    end
  end
end
