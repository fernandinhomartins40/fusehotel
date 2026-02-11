import { Request, Response } from 'express';
import faqCategoryService from '../services/faq-category.service';

class FAQCategoryController {
  async create(req: Request, res: Response) {
    try {
      const category = await faqCategoryService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Categoria de FAQ criada com sucesso',
        data: category,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao criar categoria de FAQ',
      });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const categories = await faqCategoryService.findAll();

      res.json({
        success: true,
        data: categories,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar categorias de FAQ',
      });
    }
  }

  async findAllAdmin(req: Request, res: Response) {
    try {
      const categories = await faqCategoryService.findAllAdmin();

      res.json({
        success: true,
        data: categories,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar categorias de FAQ',
      });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const category = await faqCategoryService.findById(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoria de FAQ não encontrada',
        });
      }

      res.json({
        success: true,
        data: category,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar categoria de FAQ',
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const category = await faqCategoryService.update(id, req.body);

      res.json({
        success: true,
        message: 'Categoria de FAQ atualizada com sucesso',
        data: category,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao atualizar categoria de FAQ',
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await faqCategoryService.delete(id);

      res.json({
        success: true,
        message: 'Categoria de FAQ excluída com sucesso',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao excluir categoria de FAQ',
      });
    }
  }

  async reorder(req: Request, res: Response) {
    try {
      const { items } = req.body;
      await faqCategoryService.reorder(items);

      res.json({
        success: true,
        message: 'Ordem das categorias de FAQ atualizada com sucesso',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao reordenar categorias de FAQ',
      });
    }
  }
}

export default new FAQCategoryController();
