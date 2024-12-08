import { RequestHandler } from "express";
import mongoose from "mongoose";
import ClientModel from "@models/clientModel";

interface Client {
  name: string;
  email: string;
  phone: string;
  address: string;
  userId: string;
  createdAt: Date;
}

interface ClientResponse extends Client {
  _id: mongoose.Types.ObjectId;
}

interface PaginatedResponse {
  data: ClientResponse[];
  currentPage: number;
  numberOfPages: number;
}

// Get single client by ID
export const getClient: RequestHandler<
  { id: string },
  {data: ClientResponse} | { message: string }
> = async (req, res): Promise<void> => {
  const { id } = req.params;

  try {
    const client = await ClientModel.findById(id);
    if (!client) {
      res.status(404).json({ message: "Client not found" });
      return;
    }
    res.status(200).json({data: client});
  } catch (error) {
    res.status(404).json({
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

// Get paginated clients
export const getClients: RequestHandler<
  {},
  PaginatedResponse | { message: string },
  {},
  { page: string }
> = async (req, res): Promise<void> => {
  const { page } = req.query;

  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT;

    const total = await ClientModel.countDocuments({});
    const clients = await ClientModel.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.json({
      data: clients,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

// Create new client
export const createClient: RequestHandler<
  {},
  {data: ClientResponse} | { message: string },
  Client
> = async (req, res): Promise<void> => {
  const client = req.body;
  console.log(client)

  const newClient = new ClientModel({
    ...client,
    createdAt: new Date().toISOString(),
  });

  try {
    await newClient.save();
    res.status(201).json({ message: `${newClient._id} was created` });
  } catch (error) {
    res.status(409).json({
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

// Update existing client
export const updateClient: RequestHandler<
  { id: string },
  ClientResponse | { message: string },
  Partial<Client>
> = async (req, res): Promise<void> => {
  const { id } = req.params;
  const client = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ message: "No client with that id" });
    return;
  }

  try {
    const updatedClient = await ClientModel.findByIdAndUpdate(
      id,
      { ...client, _id: id },
      { new: true }
    );

    if (!updatedClient) {
      res.status(404).json({ message: "Client not found" });
      return;
    }

    res.json({message: `${updatedClient._id} was updated`});
  } catch (error) {
    res.status(409).json({
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

// Delete client
export const deleteClient: RequestHandler<
  { id: string },
  { message: string }
> = async (req, res): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ message: `No Client with ${id}` });
    return;
  }

  try {
    const result = await ClientModel.findByIdAndRemove(id);

    if (!result) {
      res.status(404).json({ message: `${id} not found` });
      return;
    }

    res.json({ message: `${id} was deleted successfully` });
  } catch (error) {
    res.status(409).json({
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

// Get clients by user
export const getClientsByUser: RequestHandler<
  {},
  { data: ClientResponse[] } | { message: string },
  {},
  { searchQuery: string }
> = async (req, res): Promise<void> => {
  const { searchQuery } = req.query;

  try {
    const clients = await ClientModel.find({ userId: searchQuery });
    res.json({ data: clients });
  } catch (error) {
    res.status(404).json({
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};
