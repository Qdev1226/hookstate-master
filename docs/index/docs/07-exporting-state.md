---
id: exporting-state
title: Exporting state
sidebar_label: Exporting state
---

import { PreviewSample } from '../src/PreviewSample'

If you would like to implement and expose a custom global state without exposing Hookstate details,
you can wrap a state object by a custom interface. For example:

<PreviewSample example="global-getting-started-interface" />

The other more complex example can be found in [the demo application](https://github.com/avkonst/hookstate/tree/master/docs/demos/todolist), where settings state is mapped directly to a hook which returns state access interface when used.
