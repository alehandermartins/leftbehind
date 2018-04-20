module LB
  class Action::Vote < Action::Base
    include Cooperative

    def run context
      super context

      return @context if computed?
      add_status :success

      @context
    end

    def resolve context
      super context
      return @context if resolved?

      votes_by_player = initialize_votes_by_player
      votes_by_player = count_votes_for votes_by_player
      winners = election_winners votes_by_player, winners_number

      @context.team.information.add_to :voting, slot, info(winners, votes_by_player)
      log_voting_to_everyone winners, votes_by_player
      votes_by_player = initialize_votes_by_player

      (same_actions).each {|same_action|
        same_action.add_status :resolved
      }

      @context
    end

    private

    def initialize_votes_by_player
      the_candidates = {}
      @context.players.identifiers.map { |id|
        the_candidates[id] = 0
      }
      the_candidates
    end

    def count_votes_for votes_by_player
      (same_actions).each {|same_action|
        selected = same_action.payload[:target]
        selected.each{ |selection|
          votes_by_player[selection] += 1
        }
      }
      votes_by_player
    end

    def election_winners votes_by_player, desired_winners_number
      the_winners = []
      the_candidates = votes_by_player.dup
      desired_winners_number.times {
        the_winner = @context.team.winner_selection.winner_from(the_candidates)
        the_winners.push(the_winner)
        the_candidates.delete(the_winner)
      }
      the_winners
    end

    def winners_number
      food_available = @context.team.inventory[:food]
      alive_players = @context.players.alive.size
      alive_players - food_available
    end

    def log_voting_to_everyone winners, results
      @context.players.each{ |the_player|
        the_player.information.add_action the_player.uuid, slot, info(winners, results)
      }
    end

    def info winners, results
      {
        action: self.class.name,
        result: {winners: winners, results: results}
      }
    end
  end
end
