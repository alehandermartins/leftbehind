require_relative './player'

class Players
  def initialize players
    @players = players
  end

  def [] uuid
    players.select{ |the_player| the_player.uuid == uuid }.first
  end

  def each &block
    return @players.each &block if block
    players.each
  end

  def map &block
    return @players.map &block if block
    players.map
  end

  def reject &block
    return @players.reject &block if block
    players.reject
  end

  def to_h
    players.map { |the_player|
      [the_player.uuid, the_player.to_h]
    }.to_h
  end

  def to_a
    players.map{ |the_player|
      the_player
    }    
  end

  def identifiers
    players.map { |the_player|
      the_player.uuid
    }
  end

  def number
    players.length
  end

  def alive
    players.select{ |the_player|
      the_player.alive?
    }
  end

  private
  attr_reader :players
end
