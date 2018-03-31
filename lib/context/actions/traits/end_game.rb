module LB
  module EndGame

    def escaped_action the_action
      the_action.add_status :fail
      the_action.add_info reason: 'action.escape.result.you_left'
    end

    def trapped_action the_action
      the_action.add_status :fail
      the_action.add_info reason: 'action.escape.result.target_left'
    end
  end
end
