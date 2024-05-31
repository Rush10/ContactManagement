export class CreateAddressRequest {
  street?: string;
  city?: string;
  province?: string;
  country: string;
  postal_code: string;
  contact_id: number;
}

export class UpdateAddressRequest {
  id: number;
  street?: string;
  city?: string;
  province?: string;
  country: string;
  postal_code: string;
  contact_id: number;
}

export class GetAddressRequest {
  address_id: number;
  contact_id: number;
}

export class RemoveAddressRequest {
  address_id: number;
  contact_id: number;
}

export class AddressResponse {
  id: number;
  street?: string;
  city?: string;
  province?: string;
  country: string;
  postal_code: string;
}
