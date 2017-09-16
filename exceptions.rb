module LB
  class Invalid < StandardError
  end

  class Invalid::GameName < Invalid
    def message
      'invalid_game_name'
    end
  end

  class Invalid::Game < Invalid
    def message
      'invalid_game_uuid'
    end
  end

  class Invalid::Player < Invalid
    def message
      'already_in_this_game'
    end
  end

  class Invalid::Name < Invalid
    def message
      'invalid_player_name'
    end
  end
end


