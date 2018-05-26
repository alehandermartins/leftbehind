class Player

  attr_reader :uuid, :name, :role, :inventory, :information, :events, :traits, :brainscan
  attr_accessor :status, :sidequest, :target, :code

  def initialize uuid, name, role, information
    @uuid = uuid
    @name = name
    @role = role
    @information = information
    @inventory = Inventory.new
    @status = :alive
    @sidequest
    @events = []
    @traits = []
    @fix = 0
    @target
    @code
    @brainscan = 0
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
    return :ok if @fix == 6
    :broken
  end

  def fix amount = 1
    @fix += amount if condition == :broken
  end

  def scan_brain amount = 1
    @brainscan += amount if @brainscan < 4
  end

  def fix_left
    @fix
  end

  def calculate_fix
    goodType = @traits.include?(:c3po)
    return ((@fix - 2) * 100 / 4).ceil if goodType
    (@fix * 100 / 6).ceil
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
