module LB
  module EndGame

    def escaped_action the_action = nil
      if the_action.nil?
        add_status :fail
        add_info reason: 'action.escape.result.you_left'
      else
        the_action.add_status :fail
        the_action.add_info reason: 'action.escape.result.you_left'
      end
    end

    def trapped_action the_action
      the_action.add_status :fail
      the_action.add_info reason: 'action.escape.result.target_left'
    end
  end
end
