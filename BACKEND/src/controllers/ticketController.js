const Ticket = require('../models/Ticket');

// @desc    Validate a scanned ticket by QR or Ticket Number
// @route   POST /api/v1/tickets/validate
// @access  Private
exports.validateTicket = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Code is required' });
    }

    const ticket = await Ticket.findOne({
      templeId: req.user.templeId,
      $or: [{ ticketNumber: code }, { qrCode: code }]
    });

    if (!ticket) {
      return res.json({ success: true, validationStatus: 'INVALID', data: null });
    }

    // Determine validation status
    let validationStatus = 'VALID';
    if (ticket.status === 'used') {
      validationStatus = 'USED';
    } else if (ticket.status === 'cancelled') {
      validationStatus = 'INVALID';
    } else {
      // Check date expiration
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const ticketDate = new Date(ticket.validForDate);
      ticketDate.setHours(0, 0, 0, 0);
      
      if (ticketDate < today) {
        validationStatus = 'EXPIRED';
        // Auto-expire
        if (ticket.status === 'issued') {
          ticket.status = 'expired';
          await ticket.save();
        }
      }
    }

    const data = {
      id: ticket.ticketNumber,
      type: ticket.ticketType,
      section: ticket.sectionName,
      persons: ticket.adultCount + ticket.childCount,
      date: ticket.validForDate.toISOString().split('T')[0],
      slot: ticket.slotTime,
      scannedAt: ticket.usedAt ? ticket.usedAt.toISOString() : undefined
    };

    res.json({ success: true, validationStatus, data });
  } catch (error) {
    console.error('validateTicket error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Mark a valid ticket as used
// @route   POST /api/v1/tickets/mark-used
// @access  Private
exports.markTicketUsed = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Code is required' });
    }

    const ticket = await Ticket.findOne({
      templeId: req.user.templeId,
      $or: [{ ticketNumber: code }, { qrCode: code }]
    });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    if (ticket.status !== 'issued') {
      return res.status(400).json({ success: false, message: `Cannot use ticket, currently ${ticket.status}` });
    }

    ticket.status = 'used';
    ticket.usedAt = new Date();
    await ticket.save();

    const io = req.app.get('socketio');
    if (io) io.emit('DASHBOARD_UPDATE', { timestamp: Date.now() });

    res.json({ success: true, data: ticket });
  } catch (error) {
    console.error('markTicketUsed error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
