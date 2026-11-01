import { afterEach, describe, expect, it, vi } from 'vitest';
import { request } from '../api.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('request', () => {
  it('returns the response data when the request succeeds', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({
        data: {
          id: 1,
          name: 'Keyboard',
        },
      }),
    });

    const result = await request('/products');

    expect(result).toEqual({
      data: {
        id: 1,
        name: 'Keyboard',
      },
    });

    expect(fetch).toHaveBeenCalledWith('/api/products', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('returns null when the server responds with status 204', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      status: 204,
      ok: true,
    });

    const result = await request('/products/1');

    expect(result).toBeNull();
  });

  it('throws an error when the server returns a failed request', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      status: 400,
      ok: false,
      json: async () => ({
        error: {
          message: 'Invalid product',
        },
      }),
    });

    await expect(request('/products')).rejects.toThrow('Invalid product');
  });
});
