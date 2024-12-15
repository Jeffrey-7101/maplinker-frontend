// src/services/api.js
import { api } from 'boot/axios';

export const getNodos = async () => {
  try {
    const response = await api.get('nodos/nodos/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getConexiones = async () => {
  try {
    const response = await api.get('conexion/conexion/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createNodo = async (nodo) => {
  try {
    const response = await api.post('nodos/nodos/', nodo);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteNodo = async (id) => {
  try {
    const response = await api.delete(`nodos/nodos/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createConexion = async (conexion) => {
  try {
    const response = await api.post('conexion/conexion/', conexion);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteConexion = async (id) => {
  try {
    const response = await api.delete(`conexion/conexion/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
