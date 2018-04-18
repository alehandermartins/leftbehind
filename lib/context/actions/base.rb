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

      def add_bounty new_bounty = {}
        @result = @result || {}
        @result[:bounty] = new_bounty
      end

      def add_info message
        @result = @result || {}
        @result[:info] = @result[:info] || {}
        @result[:info].merge! message
      end

      def information action = nil
        action ||= self.class.name
        return {
          action: action,
          payload: payload,
          result: result
        }
      end

      def add_to_everyone_log player = nil, info = nil
        player ||= performer
        info ||= information
        @context.players.each{ |the_player|
          next unless the_player.alive?
          the_player.information.add_action player.uuid, slot, info
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
