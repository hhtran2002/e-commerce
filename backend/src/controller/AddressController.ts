import { Request, Response } from "express";
import { AddressService } from "../service/AddressService";

const addressService = new AddressService();

export class AddressController {
  static async addAddress(req: Request, res: Response) {
    try {
      // Lấy userId từ token (được set bởi checkJwt middleware)
      const userId = (res as any).locals.jwtPayload.userId;
      const { streetName, ward, city, country } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!streetName || !city || !country) {
        return res
          .status(400)
          .json({ message: "streetName, city, and country are required" });
      }

      const address = await addressService.addAddress(userId, {
        streetName,
        ward,
        city,
        country,
      });

      res.status(201).json({
        message: "Address added successfully",
        data: address,
      });
    } catch (error: any) {
      console.error("❌ Error in addAddress:", error);
      res.status(400).json({ message: error.message });
    }
  }

  static async getUserAddresses(req: Request, res: Response) {
    try {
      const userIdParam = req.params.userId;
      if (!userIdParam) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const userId = parseInt(userIdParam);

      const addresses = await addressService.getUserAddresses(userId);

      res.status(200).json({
        message: "Addresses retrieved successfully",
        data: addresses,
      });
    } catch (error: any) {
      console.error("❌ Error in getUserAddresses:", error);
      res.status(400).json({ message: error.message });
    }
  }

  static async updateAddress(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      if (!idParam) {
        return res.status(400).json({ message: "Address ID is required" });
      }
      const addressId = parseInt(idParam);
      // Lấy userId từ token (được set bởi checkJwt middleware)
      const userId = (res as any).locals.jwtPayload.userId;
      const { streetName, ward, city, country } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const address = await addressService.updateAddress(addressId, userId, {
        streetName,
        ward,
        city,
        country,
      });

      res.status(200).json({
        message: "Address updated successfully",
        data: address,
      });
    } catch (error: any) {
      console.error("❌ Error in updateAddress:", error);
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteAddress(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      if (!idParam) {
        return res.status(400).json({ message: "Address ID is required" });
      }
      const addressId = parseInt(idParam);
      // Lấy userId từ token (được set bởi checkJwt middleware)
      const userId = (res as any).locals.jwtPayload.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      await addressService.deleteAddress(addressId, userId);

      res.status(200).json({
        message: "Address deleted successfully",
      });
    } catch (error: any) {
      console.error("❌ Error in deleteAddress:", error);
      res.status(400).json({ message: error.message });
    }
  }
}
