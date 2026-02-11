import { Request, Response } from 'express';
import faqItemService from '../services/faq-item.service';

class FAQItemController {
  async create(req: Request, res: Response) {
    try {
      const item = await faqItemService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Pergunta de FAQ criada com sucesso',
        data: item,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao criar pergunta de FAQ',
      });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const items = await faqItemService.findAll();

      res.json({
        success: true,
        data: items,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar perguntas de FAQ',
      });
    }
  }

  async findAllAdmin(req: Request, res: Response) {
    try {
      const items = await faqItemService.findAllAdmin();

      res.json({
        success: true,
        data: items,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar perguntas de FAQ',
      });
    }
  }

  async findByCategoryId(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      const items = await faqItemService.findByCategoryId(categoryId);

      res.json({
        success: true,
        data: items,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar perguntas de FAQ',
      });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const item = await faqItemService.findById(id);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Pergunta de FAQ não encontrada',
        });
      }

      res.json({
        success: true,
        data: item,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar pergunta de FAQ',
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const item = await faqItemService.update(id, req.body);

      res.json({
        success: true,
        message: 'Pergunta de FAQ atualizada com sucesso',
        data: item,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao atualizar pergunta de FAQ',
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await faqItemService.delete(id);

      res.json({
        success: true,
        message: 'Pergunta de FAQ excluída com sucesso',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao excluir pergunta de FAQ',
      });
    }
  }

  async reorder(req: Request, res: Response) {
    try {
      const { items } = req.body;
      await faqItemService.reorder(items);

      res.json({
        success: true,
        message: 'Ordem das perguntas de FAQ atualizada com sucesso',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao reordenar perguntas de FAQ',
      });
    }
  }
}

export default new FAQItemController();
