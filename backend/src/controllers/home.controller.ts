import type { Request, Response } from 'express';

export const getHome = async (req: Request, res: Response) => {
    res.send("Api is working");
}