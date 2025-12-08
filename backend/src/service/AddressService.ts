import { AppDataSource } from "../config/data_source";
import { UserAddress } from "../entity/UserAddress";
import { User } from "../entity/User";

export class AddressService {
  private addressRepository = AppDataSource.getRepository(UserAddress);
  private userRepository = AppDataSource.getRepository(User);

  // -- Thêm địa chỉ mới --
  async addAddress(userId: number, data: any) {
    const { streetName, ward, city, country } = data;

    // Kiểm tra user tồn tại
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error("User not found");
    }

    // Tạo địa chỉ mới
    const newAddress = new UserAddress();
    newAddress.streetName = streetName;
    if (ward !== undefined) newAddress.ward = ward;
    newAddress.city = city;
    newAddress.country = country;
    newAddress.user = user;

    return await this.addressRepository.save(newAddress);
  }

  // -- Lấy tất cả địa chỉ của user --
  async getUserAddresses(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error("User not found");
    }

    return await this.addressRepository.find({
      where: { user: { id: userId } },
    });
  }

  // -- Lấy một địa chỉ theo ID --
  async getAddressById(addressId: number) {
    const address = await this.addressRepository.findOneBy({ id: addressId });
    if (!address) {
      throw new Error("Address not found");
    }
    return address;
  }

  // -- Cập nhật địa chỉ --
  async updateAddress(addressId: number, userId: number, data: any) {
    const { streetName, ward, city, country } = data;

    const address = await this.addressRepository.findOne({
      where: { id: addressId, user: { id: userId } },
    });

    if (!address) {
      throw new Error("Address not found or you don't have permission to edit");
    }

    address.streetName = streetName || address.streetName;
    if (ward !== undefined) address.ward = ward || address.ward;
    address.city = city || address.city;
    address.country = country || address.country;

    return await this.addressRepository.save(address);
  }

  // -- Xóa địa chỉ --
  async deleteAddress(addressId: number, userId: number) {
    const address = await this.addressRepository.findOne({
      where: { id: addressId, user: { id: userId } },
    });

    if (!address) {
      throw new Error(
        "Address not found or you don't have permission to delete"
      );
    }

    return await this.addressRepository.remove(address);
  }
}
