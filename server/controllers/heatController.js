const { Heat } = require('../models');

class HeatController {
  static async createHeat(req, res) {
    try {
      const { raceRunId, heatNumber } = req.body;

      const newHeat = await Heat.create({
        raceRunId,
        heatNumber
      });

      return res.status(201).json(newHeat);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error creating heat' });
    }
  }

  static async getHeatsByRaceRun(req, res) {
    try {
      const { raceRunId } = req.params;

      const heats = await Heat.findAll({
        where: { raceRunId }
      });

      return res.status(200).json(heats);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching heats' });
    }
  }

  static async getHeatById(req, res) {
    try {
      const { id } = req.params;

      const heat = await Heat.findByPk(id);

      if (!heat) {
        return res.status(404).json({ message: 'Heat not found' });
      }

      return res.status(200).json(heat);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching heat' });
    }
  }

  static async updateHeat(req, res) {
    try {
      const { id } = req.params;
      const { raceRunId, heatNumber } = req.body;

      const heat = await Heat.findByPk(id);

      if (!heat) {
        return res.status(404).json({ message: 'Heat not found' });
      }

      heat.raceRunId = raceRunId || heat.raceRunId;
      heat.heatNumber = heatNumber || heat.heatNumber;

      await heat.save();

      return res.status(200).json(heat);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error updating heat' });
    }
  }

  static async deleteHeat(req, res) {
    try {
      const { id } = req.params;

      const heat = await Heat.findByPk(id);

      if (!heat) {
        return res.status(404).json({ message: 'Heat not found' });
      }

      await heat.destroy();

      return res.status(200).json({ message: 'Heat deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error deleting heat' });
    }
  }
}

module.exports = HeatController;
