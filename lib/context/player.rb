class Player

  attr_reader :uuid, :name, :role, :inventory, :information, :sidequest, :events, :traits
  attr_accessor :status, :target

  def initialize uuid, name, role, sidequest, information
    @uuid = uuid
    @name = name
    @role = role
    @sidequest = sidequest
    @information = information
    @inventory = Inventory.new
    @status = :alive
    @events = []
    @traits = []
    @fix = 6
    @target
  end

  def information_for players
    @information.for players
  end

  def add_event event
    @events.push event
  end

  def add_trait trait
    @traits.push trait
    @information.add_trait uuid, trait
  end

  def alive?
    @status == :alive
  end

  def android?
    @traits.include?(:c3po) || @traits.include?(:terminator)
  end

  def condition
    return :dead unless alive? || escaped?
    return :ok unless android?
    return :ok if @fix == 0
    :broken
  end

  def fix amount = 1
    @fix -= amount if condition == :broken
  end

  def fix_left
    @fix
  end

  def calculate_fix
    goodType = @traits.include?(:c3po)
    return ((4 - @fix) * 100 / 4).ceil if goodType
    ((6 - @fix) * 100 / 6).ceil
  end

  def kill
    @status = :dead
  end

  def crash
    @status = :crashed
  end

  def ia_kill
    @status = :killed
  end

  def disconnect
    @status = :disconnected
  end

  def escape
    @status = :escaped
  end

  def trap
    @status = :trapped
  end

  def radiate
    @status = :radiated
  end

  def explode
    @status = :exploded
  end

  def escaped?
    @status == :escaped
  end

  def trapped?
    @status == :trapped
  end

  def to_h
    {
      uuid: uuid,
      name: name,
      status: status,
      inventory: inventory.to_h
    }
  end

  def action_at slot
    actions.select{ |the_action| the_action.slot == slot}.first
  end
end
