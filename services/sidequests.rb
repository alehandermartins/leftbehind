module Sidequests
	class << self
		def run context
			events = Hash.new
			players = context.players.to_a
			deliver_sidequests players, random_generator

      androidQuest players, events
      betrayerQuest players, events
      
      events
    end

    def deliver_sidequests players, random_generator
      sidequests = [:android, :betrayer].shuffle(random: random_generator)
      sidequests.each_with_index { |sidequest, indx|
      	next unless players[indx].sidequest.nil? 
        players[indx].sidequest = sidequest
      }
    end

    def androidQuest players, events
    	player = players.detect { |player| player.sidequest == :android }
    	return if player.nil?
      events[player.uuid] = :inject if !player.events.include?(:inject)
      events[player.uuid] = :android if !player.events.include?(:android) && player.traits.include?(:android)
    	events[player.uuid] = :defaultEvent if events[player.uuid].nil?
    end

    def betrayerQuest players, events
    	player = players.detect { |player| player.sidequest == :betrayer }
    	return if player.nil?
      events[player.uuid] = :fusion unless player.events.include?(:fusion)
    	events[player.uuid] = :betray if !player.events.include?(:betray)
    	events[player.uuid] = :gunsmith if !player.events.include?(:gunsmith) && player.traits.include?(:betrayer)
      events[player.uuid] = :hitman if !player.events.include?(:hitman) && player.inventory.has_key?(:gun)
    	events[player.uuid] = :defaultEvent if events[player.uuid].nil?
    end
	end
end