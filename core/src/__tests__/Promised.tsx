import { useHookstate, hookstate, none } from '../';

import { renderHook, act } from '@testing-library/react-hooks';

test('primitive: should rerender used on promise resolve', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate(0)
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.get()).toStrictEqual(0);

    const promise = new Promise<number>(resolve => setTimeout(() => {
        act(() => resolve(100))
    }, 500))
    act(() => {
        result.current.set(promise);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.promised).toStrictEqual(true);
    expect(result.current.promise?.then(i => i)).toBeTruthy();
    expect(() => result.current.keys)
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');
    expect(() => result.current.get())
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');

    expect(() => result.current.set(200))
        .toThrow('Error: HOOKSTATE-104 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-104')
        
    await act(async () => {
        await promise;
    })
    expect(renderTimes).toStrictEqual(3);
    expect(result.current.promised).toStrictEqual(false);
    expect(result.current.error).toEqual(undefined);
    expect(result.current.get()).toEqual(100);
});

test('primitive: should rerender used on promise resolve immediately', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate(0)
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.get()).toStrictEqual(0);

    const promise = Promise.resolve(100);
    act(() => {
        result.current.set(promise);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.promised).toStrictEqual(true);
    let p = result.current.promise?.then(i => i.value)
    expect(p).toBeTruthy();
    expect(() => result.current.keys)
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');
    expect(() => result.current.get())
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');

    expect(() => result.current.set(200))
        .toThrow('Error: HOOKSTATE-104 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-104')
        
    await act(async () => {
        await promise;
    })
    expect(renderTimes).toStrictEqual(3);
    expect(result.current.promised).toStrictEqual(false);
    expect(result.current.error).toEqual(undefined);
    expect(result.current.get()).toEqual(100);
    expect(await p).toEqual(100)
});

test('primitive: should rerender used on promise resolve immediately global', async () => {
    let renderTimes = 0
    let state = hookstate(async () => {
        return 100
    });
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate(state)
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.promised).toStrictEqual(true);
        
    await act(async () => {
        await new Promise((resolve,) => setTimeout(resolve, 0));
    })
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.promised).toStrictEqual(false);
    expect(result.current.error).toEqual(undefined);
    expect(result.current.get()).toEqual(100);
});

test('array: should rerender used on promise resolve', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate([0])
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current[0].get()).toStrictEqual(0);

    const promise = new Promise<number[]>(resolve => setTimeout(() => {
        act(() => resolve([100]))
    }, 500))
    act(() => {
        result.current.set(promise);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.promised).toStrictEqual(true);
    expect(() => result.current.keys)
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');
    expect(() => result.current.get())
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');

    expect(() => result.current.set([200]))
        .toThrow('Error: HOOKSTATE-104 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-104')
        
    await act(async () => {
        await promise;
    })
    expect(renderTimes).toStrictEqual(3);
    expect(result.current.promised).toStrictEqual(false);
    expect(result.current.get()).toEqual([100]);
});

test('array: should rerender used on promise resolve (global)', async () => {
    let renderTimes = 0
    const state = hookstate([0])
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate(state)
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current[0].get()).toStrictEqual(0);

    const promise = new Promise<number[]>(resolve => setTimeout(() => {
        act(() => resolve([100]))
    }, 500))
    act(() => {
        result.current.set(promise);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.promised).toStrictEqual(true);
    let p = result.current.promise?.then(i => i.value)
    expect(p).toBeTruthy();
    expect(() => result.current.keys)
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');
    expect(() => result.current.get())
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');

    expect(() => result.current.set([200]))
        .toThrow('Error: HOOKSTATE-104 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-104')
        
    await act(async () => {
        await promise;
    })
    expect(renderTimes).toStrictEqual(3);
    expect(result.current.promised).toStrictEqual(false);
    expect(result.current.get()).toEqual([100]);
    
    expect(await p).toEqual([100])
});

test('array: should rerender used on promise resolve (global promise)', async () => {
    let renderTimes = 0
    const state = hookstate(new Promise<number[]>(resolve => setTimeout(() => {
        act(() => resolve([100]))
    }, 500)))
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate(state)
    });
    expect(renderTimes).toStrictEqual(1);

    expect(result.current.promised).toStrictEqual(true);
    expect(() => result.current.keys)
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');
    expect(() => result.current.get())
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');

    expect(() => result.current.set([200]))
        .toThrow('Error: HOOKSTATE-104 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-104')
});

test('primitive: should rerender used on promise resolve manual', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate(none)
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.promised).toStrictEqual(true);
    let p = result.current.promise?.then(i => i.value)
    expect(p).toBeTruthy();
    
    expect(() => result.current.value)
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');
    expect(() => result.current.get())
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');

    act(() => {
        result.current.set(100);
    });

    expect(renderTimes).toStrictEqual(2);
    expect(result.current.promised).toStrictEqual(false);
    expect(result.current.value).toEqual(100);
    expect(result.current.get()).toEqual(100);
    
    expect(await p).toEqual(100)
});

test('primitive: should rerender used on promise resolve second', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate(() => new Promise<number>(resolve => setTimeout(() => {
            act(() => resolve(100))
        }, 500)))
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.promised).toStrictEqual(true);
    expect(() => result.current.value)
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');
    expect(() => result.current.get())
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');

    const promise = new Promise<number>(resolve => setTimeout(() => {
        act(() => resolve(200))
    }, 500))
    act(() => {
        result.current.set(promise);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.promised).toStrictEqual(true);
    expect(() => result.current.value)
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');
    expect(() => result.current.get())
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');

    await act(async () => {
        await promise;
    })
    expect(renderTimes).toStrictEqual(3);
    expect(result.current.promised).toStrictEqual(false);
    expect(result.current.value).toEqual(200);
    expect(result.current.get()).toEqual(200);
});

test('primitive: should rerender used on promise resolved', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate(0)
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.get()).toStrictEqual(0);

    const promise = Promise.resolve(100)
    act(() => {
        result.current.set(promise);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.promised).toStrictEqual(true);
    expect(() => result.current.value)
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');
    expect(() => result.current.get())
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');

    await act(async () => {
        await promise;
    })
    expect(renderTimes).toStrictEqual(3);
    expect(result.current.promised).toStrictEqual(false);
    expect(result.current.value).toEqual(100);
    expect(result.current.get()).toEqual(100);
});

test('primitive: should rerender used on promise reject', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate(0)
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.get()).toStrictEqual(0);

    const promise = new Promise<number>((resolve, reject) => setTimeout(() => {
        act(() => reject('some error promise'))
    }, 500))
    act(() => {
        result.current.set(promise);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.promised).toStrictEqual(true);
    expect(() => result.current.value)
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');
    expect(() => result.current.get())
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');

    try {
        await act(async () => {
            await promise
            return undefined
        });
    } catch (err) {
        // ignore
    }
    expect(renderTimes).toStrictEqual(3);
    expect(result.current.promised).toStrictEqual(false);
    expect(result.current.error).toEqual('some error promise');
    expect(() => result.current.get()).toThrow('some error promise');
});

test('primitive: should rerender used on promise rejected', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate(0)
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.get()).toStrictEqual(0);

    const promise = Promise.reject('some error rejected')
    act(() => {
        result.current.set(promise);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.promised).toStrictEqual(true);
    expect(() => result.current.value)
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');
    expect(() => result.current.get())
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');

    await act(async () => {
        try {
            await promise;
        } catch (err) {
            // ignore
        }
    })
    expect(renderTimes).toStrictEqual(3);
    expect(result.current.promised).toStrictEqual(false);
    expect(result.current.error).toEqual('some error rejected');
    expect(() => result.current.get()).toThrow('some error rejected');
});

test('primitive: should rerender used on promise resolve init', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate(() => new Promise<number>(resolve => setTimeout(() => {
            act(() => resolve(100))
        }, 500)))
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.promised).toStrictEqual(true);
    expect(() => result.current.value)
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');
    expect(() => result.current.get())
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');

    await act(async () => {
        await new Promise(resolve => setTimeout(() => act(() => resolve(0)), 600));
    })
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.promised).toStrictEqual(false);
    expect(result.current.get()).toEqual(100);
});

test('primitive: should rerender used on promise resolve init global', async () => {
    let renderTimes = 0

    const stateInf = hookstate(new Promise<number>(resolve => setTimeout(() => {
        act(() => resolve(100))
    }, 500)))

    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate(stateInf)
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.promised).toStrictEqual(true);
    expect(() => result.current.value)
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');
    expect(() => result.current.get())
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');

    await act(async () => {
        await new Promise(resolve => setTimeout(() => act(() => resolve(0)), 600));
    })
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.promised).toStrictEqual(false);
    expect(result.current.get()).toEqual(100);
});

test('primitive: should rerender used on promise reject init global', async () => {
    let renderTimes = 0

    const stateInf = hookstate(new Promise<number>((resolve, reject) => setTimeout(() => {
        act(() => reject('some error init global'))
    }, 500)))

    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate(stateInf)
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.promised).toStrictEqual(true);
    expect(() => result.current.value)
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');
    expect(() => result.current.get())
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');

    try {
        await act(async () => {
            await new Promise(resolve => setTimeout(() => act(() => resolve(0)), 600));
        })
    } catch (err) {
        //
    }
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.promised).toStrictEqual(false);
    expect(result.current.error).toEqual('some error init global');
    expect(() => result.current.get()).toThrow('some error init global');
});

test('primitive: should set after promise reject', async () => {
    let renderTimes = 0

    const stateInf = hookstate(new Promise<number>((resolve, reject) => setTimeout(() => {
        act(() => reject('some error init global'))
    }, 500)))

    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate(stateInf)
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.promised).toStrictEqual(true);
    expect(() => result.current.value)
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');
    expect(() => result.current.get())
        .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');

    try {
        await act(async () => {
            await new Promise(resolve => setTimeout(() => act(() => resolve(0)), 600));
        })
    } catch (err) {
        //
    }
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.promised).toStrictEqual(false);
    expect(result.current.error).toEqual('some error init global');
    expect(() => result.current.get()).toThrow('some error init global');
    
    act(() => {
        result.current.set(5)
    })
    expect(renderTimes).toStrictEqual(3);
    expect(result.current.promised).toStrictEqual(false);
    expect(result.current.error).toEqual(undefined);
    expect(result.current.get()).toEqual(5);
});
