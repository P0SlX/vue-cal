var oe = Object.defineProperty;
var re = (e, t, i) => t in e ? oe(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i;
var W = (e, t, i) => (re(e, typeof t != "symbol" ? t + "" : t, i), i);
import { openBlock as h, createElementBlock as c, Fragment as T, renderList as S, normalizeClass as b, normalizeStyle as $, createVNode as U, Transition as R, withCtx as g, createElementVNode as k, renderSlot as w, toDisplayString as f, createCommentVNode as m, createTextVNode as M, resolveComponent as j, createBlock as H, resolveDynamicComponent as de, createSlots as X, withKeys as Z, withModifiers as L, TransitionGroup as ue, normalizeProps as J, mergeProps as Q } from "vue";
/**
  * vue-cal v4.8.1
  * (c) 2023 Antoni Andre <antoniandre.web@gmail.com>
  * @license MIT
  */
let N, ee, te, O, z = {}, F = {};
class he {
  constructor(t) {
    W(this, "_vuecal", null);
    W(this, "selectCell", (t = !1, i, n) => {
      this._vuecal.$emit("cell-click", n ? { date: i, split: n } : i), this._vuecal.clickToNavigate || t ? this._vuecal.switchToNarrowerView() : this._vuecal.dblclickToNavigate && "ontouchstart" in window && (this._vuecal.domEvents.dblTapACell.taps++, setTimeout(() => this._vuecal.domEvents.dblTapACell.taps = 0, this._vuecal.domEvents.dblTapACell.timeout), this._vuecal.domEvents.dblTapACell.taps >= 2 && (this._vuecal.domEvents.dblTapACell.taps = 0, this._vuecal.switchToNarrowerView(), this._vuecal.$emit("cell-dblclick", n ? { date: i, split: n } : i)));
    });
    W(this, "keyPressEnterCell", (t, i) => {
      this._vuecal.$emit("cell-keypress-enter", i ? { date: t, split: i } : t), this._vuecal.switchToNarrowerView();
    });
    W(this, "getPosition", (t) => {
      const { left: i, top: n } = this._vuecal.cellsEl.getBoundingClientRect(), { clientX: o, clientY: s } = "ontouchstart" in window && t.touches ? t.touches[0] : t;
      return { x: o - i, y: s - n };
    });
    W(this, "minutesAtCursor", (t) => {
      let i = 0, n = { x: 0, y: 0 };
      const { timeStep: o, timeCellHeight: s, timeFrom: a } = this._vuecal.$props;
      return typeof t == "number" ? i = t : typeof t == "object" && (n = this.getPosition(t), i = Math.round(n.y * o / parseInt(s) + a)), { minutes: Math.max(Math.min(i, 1440), 0), cursorCoords: n };
    });
    this._vuecal = t;
  }
}
const q = 1440;
let D, y, K;
class ce {
  constructor(t, i) {
    W(this, "_vuecal", null);
    W(this, "eventDefaults", { _eid: null, start: "", startTimeMinutes: 0, end: "", endTimeMinutes: 0, title: "", content: "", background: !1, allDay: !1, segments: null, repeat: null, daysCount: 1, deletable: !0, deleting: !1, titleEditable: !0, resizable: !0, resizing: !1, draggable: !0, dragging: !1, draggingStatic: !1, focused: !1, class: "" });
    this._vuecal = t, D = i;
  }
  createAnEvent(t, i, n) {
    if (typeof t == "string" && (t = D.stringToDate(t)), !(t instanceof Date))
      return !1;
    const o = D.dateToMinutes(t), s = o + (i = i || 120), a = D.addMinutes(new Date(t), i);
    n.end && (typeof n.end == "string" && (n.end = D.stringToDate(n.end)), n.endTimeMinutes = D.dateToMinutes(n.end));
    const l = { ...this.eventDefaults, _eid: `${this._vuecal._.uid}_${this._vuecal.eventIdIncrement++}`, start: t, startTimeMinutes: o, end: a, endTimeMinutes: s, segments: null, ...n };
    return typeof this._vuecal.onEventCreate != "function" || this._vuecal.onEventCreate(l, () => this.deleteAnEvent(l)) ? (l.startDateF !== l.endDateF && (l.daysCount = D.countDays(l.start, l.end)), this._vuecal.mutableEvents.push(l), this._vuecal.addEventsToView([l]), this._vuecal.emitWithEvent("event-create", l), this._vuecal.$emit("event-change", { event: this._vuecal.cleanupEvent(l), originalEvent: null }), l) : void 0;
  }
  addEventSegment(t) {
    t.segments || (t.segments = {}, t.segments[D.formatDateLite(t.start)] = { start: t.start, startTimeMinutes: t.startTimeMinutes, endTimeMinutes: q, isFirstDay: !0, isLastDay: !1 });
    const i = t.segments[D.formatDateLite(t.end)];
    i && (i.isLastDay = !1, i.endTimeMinutes = q);
    const n = D.addDays(t.end, 1), o = D.formatDateLite(n);
    return n.setHours(0, 0, 0, 0), t.segments[o] = { start: n, startTimeMinutes: 0, endTimeMinutes: t.endTimeMinutes, isFirstDay: !1, isLastDay: !0 }, t.end = D.addMinutes(n, t.endTimeMinutes), t.daysCount = Object.keys(t.segments).length, o;
  }
  removeEventSegment(t) {
    let i = Object.keys(t.segments).length;
    if (i <= 1)
      return D.formatDateLite(t.end);
    delete t.segments[D.formatDateLite(t.end)], i--;
    const n = D.subtractDays(t.end, 1), o = D.formatDateLite(n), s = t.segments[o];
    return i ? s && (s.isLastDay = !0, s.endTimeMinutes = t.endTimeMinutes) : t.segments = null, t.daysCount = i || 1, t.end = n, o;
  }
  createEventSegments(t, i, n) {
    const o = i.getTime(), s = n.getTime();
    let a, l, u, r = t.start.getTime(), d = t.end.getTime(), v = !1;
    for (t.end.getHours() || t.end.getMinutes() || (d -= 1e3), t.segments = {}, t.repeat ? (a = o, l = Math.min(s, t.repeat.until ? D.stringToDate(t.repeat.until).getTime() : s)) : (a = Math.max(o, r), l = Math.min(s, d)); a <= l; ) {
      let p = !1;
      const E = D.addDays(new Date(a), 1).setHours(0, 0, 0, 0);
      let _, x, V, C;
      if (t.repeat) {
        const Y = new Date(a), A = D.formatDateLite(Y);
        (v || t.occurrences && t.occurrences[A]) && (v || (r = t.occurrences[A].start, u = new Date(r).setHours(0, 0, 0, 0), d = t.occurrences[A].end), v = !0, p = !0), _ = a === u, x = A === D.formatDateLite(new Date(d)), V = new Date(_ ? r : a), C = D.formatDateLite(V), x && (v = !1);
      } else
        p = !0, _ = a === r, x = l === d && E > l, V = _ ? t.start : new Date(a), C = D.formatDateLite(_ ? t.start : V);
      p && (t.segments[C] = { start: V, startTimeMinutes: _ ? t.startTimeMinutes : 0, endTimeMinutes: x ? t.endTimeMinutes : q, isFirstDay: _, isLastDay: x }), a = E;
    }
    return t;
  }
  deleteAnEvent(t) {
    this._vuecal.emitWithEvent("event-delete", t), this._vuecal.mutableEvents = this._vuecal.mutableEvents.filter((i) => i._eid !== t._eid), this._vuecal.view.events = this._vuecal.view.events.filter((i) => i._eid !== t._eid);
  }
  checkCellOverlappingEvents(t, i) {
    K = t.slice(0), y = {}, t.forEach((s) => {
      K.shift(), y[s._eid] || (y[s._eid] = { overlaps: [], start: s.start, end: s.end, position: 0 }), y[s._eid].position = 0, K.forEach((a) => {
        y[a._eid] || (y[a._eid] = { overlaps: [], start: a.start, end: a.end, position: 0 });
        const l = this.eventInRange(a, s.start, s.end), u = i.overlapsPerTimeStep ? D.datesInSameTimeStep(s.start, a.start, i.timeStep) : 1;
        if (s.background || s.allDay || a.background || a.allDay || !l || !u) {
          let r, d;
          (r = (y[s._eid] || { overlaps: [] }).overlaps.indexOf(a._eid)) > -1 && y[s._eid].overlaps.splice(r, 1), (d = (y[a._eid] || { overlaps: [] }).overlaps.indexOf(s._eid)) > -1 && y[a._eid].overlaps.splice(d, 1), y[a._eid].position--;
        } else
          y[s._eid].overlaps.push(a._eid), y[s._eid].overlaps = [...new Set(y[s._eid].overlaps)], y[a._eid].overlaps.push(s._eid), y[a._eid].overlaps = [...new Set(y[a._eid].overlaps)], y[a._eid].position++;
      });
    });
    let n = 0;
    const o = /* @__PURE__ */ new Map();
    for (const s in y) {
      const a = y[s], l = a.overlaps.map((d) => ({ id: d, start: y[d].start, end: y[d].end }));
      l.push({ id: s, start: a.start, end: a.end }), l.sort((d, v) => d.start.valueOf() === v.start.valueOf() && d.end.valueOf() === v.end.valueOf() ? d.id < v.id ? -1 : 1 : d.start < v.start ? -1 : d.start > v.start || d.end < v.end ? 1 : -1);
      const u = l.map((d) => o.get(d.id)).filter((d) => d !== void 0);
      let r = 0;
      for (; u.includes(r); )
        r++;
      o.set(s, r), a.position = r, n = Math.max(this.getOverlapsStreak(a, y), n);
    }
    return [y, n];
  }
  getOverlapsStreak(t, i = {}) {
    let n = t.overlaps.length + 1, o = [];
    return t.overlaps.forEach((s) => {
      o.includes(s) || t.overlaps.filter((a) => a !== s).forEach((a) => {
        i[a].overlaps.includes(s) || o.push(a);
      });
    }), o = [...new Set(o)], n -= o.length, n;
  }
  eventInRange(t, i, n) {
    if (t.allDay || !this._vuecal.time) {
      const a = new Date(t.start).setHours(0, 0, 0, 0);
      return new Date(t.end).setHours(23, 59, 0, 0) >= new Date(i).setHours(0, 0, 0, 0) && a <= new Date(n).setHours(0, 0, 0, 0);
    }
    const o = t.start.getTime(), s = t.end.getTime();
    return o < n.getTime() && s > i.getTime();
  }
}
const ve = { class: "vuecal__flex vuecal__weekdays-headings" }, me = ["onClick"], pe = { class: "vuecal__flex weekday-label", grow: "" }, we = { class: "full" }, ye = { class: "small" }, De = { class: "xsmall" }, ge = { key: 0 }, fe = { key: 0, class: "vuecal__flex vuecal__split-days-headers", grow: "" }, B = (e, t) => {
  const i = e.__vccOpts || e;
  for (const [n, o] of t)
    i[n] = o;
  return i;
}, ne = B({ inject: ["vuecal", "utils", "view"], props: { transitionDirection: { type: String, default: "right" }, weekDays: { type: Array, default: () => [] }, switchToNarrowerView: { type: Function, default: () => {
} } }, methods: { selectCell(e, t) {
  e.getTime() !== this.view.selectedDate.getTime() && (this.view.selectedDate = e), this.utils.cell.selectCell(!1, e, t);
}, cleanupHeading: (e) => ({ label: e.full, date: e.date, ...e.today ? { today: e.today } : {} }) }, computed: { headings() {
  if (!["month", "week"].includes(this.view.id))
    return [];
  let e = !1;
  return this.weekDays.map((t, i) => {
    const n = this.utils.date.addDays(this.view.startDate, this.vuecal.startWeekOnSunday ? i - 1 : i);
    return { hide: t.hide, full: t.label, small: t.short || t.label.substr(0, 3), xsmall: t.short || t.label.substr(0, 1), ...this.view.id === "week" ? { dayOfMonth: n.getDate(), date: n, today: !e && this.utils.date.isToday(n) && !e++ } : {} };
  });
}, cellWidth() {
  return 100 / (7 - this.weekDays.reduce((e, t) => e + t.hide, 0));
}, weekdayCellStyles() {
  return { ...this.vuecal.hideWeekdays.length ? { width: `${this.cellWidth}%` } : {} };
}, cellHeadingsClickable() {
  return this.view.id === "week" && (this.vuecal.clickToNavigate || this.vuecal.dblclickToNavigate);
} } }, [["render", function(e, t, i, n, o, s) {
  return h(), c("div", ve, [(h(!0), c(T, null, S(s.headings, (a, l) => (h(), c(T, { key: l }, [a.hide ? m("", !0) : (h(), c("div", { key: 0, class: b(["vuecal__flex vuecal__heading", { today: a.today, clickable: s.cellHeadingsClickable }]), style: $(s.weekdayCellStyles), onClick: (u) => s.view.id === "week" && s.selectCell(a.date, u), onDblclick: t[0] || (t[0] = (u) => s.view.id === "week" && s.vuecal.dblclickToNavigate && i.switchToNarrowerView()) }, [U(R, { name: `slide-fade--${i.transitionDirection}`, appear: s.vuecal.transitions }, { default: g(() => [(h(), c("div", { class: "vuecal__flex", column: "", key: !!s.vuecal.transitions && `${l}-${a.dayOfMonth}` }, [k("div", pe, [w(e.$slots, "weekday-heading", { heading: s.cleanupHeading(a), view: s.view }, () => [k("span", we, f(a.full), 1), k("span", ye, f(a.small), 1), k("span", De, f(a.xsmall), 1), a.dayOfMonth ? (h(), c("span", ge, "\xA0" + f(a.dayOfMonth), 1)) : m("", !0)])]), s.vuecal.hasSplits && s.vuecal.stickySplitLabels ? (h(), c("div", fe, [(h(!0), c(T, null, S(s.vuecal.daySplits, (u, r) => (h(), c("div", { class: b(["day-split-header", u.class || !1]), key: r }, [w(e.$slots, "split-label", { split: u, view: s.view }, () => [M(f(u.label), 1)])], 2))), 128))])) : m("", !0)]))]), _: 2 }, 1032, ["name", "appear"])], 46, me))], 64))), 128))]);
}]]), _e = { class: "vuecal__header" }, ke = { key: 0, class: "vuecal__flex vuecal__menu", role: "tablist", "aria-label": "Calendar views navigation" }, be = ["onDragenter", "onDragleave", "onClick", "aria-label"], Te = { key: 1, class: "vuecal__title-bar" }, Ee = ["aria-label"], Ce = { class: "vuecal__flex vuecal__title", grow: "" }, Me = ["aria-label"], Se = { key: 0, class: "vuecal__flex vuecal__split-days-headers" }, Oe = B({ inject: ["vuecal", "previous", "next", "switchView", "updateSelectedDate", "modules", "view"], components: { WeekdaysHeadings: ne }, props: { options: { type: Object, default: () => ({}) }, editEvents: { type: Object, required: !0 }, hasSplits: { type: [Boolean, Number], default: !1 }, daySplits: { type: Array, default: () => [] }, viewProps: { type: Object, default: () => ({}) }, weekDays: { type: Array, default: () => [] }, switchToNarrowerView: { type: Function, default: () => {
} } }, data: () => ({ highlightedControl: null }), methods: { goToToday() {
  this.updateSelectedDate(new Date(new Date().setHours(0, 0, 0, 0)));
}, switchToBroaderView() {
  this.transitionDirection = "left", this.broaderView && this.switchView(this.broaderView);
} }, computed: { transitionDirection: { get() {
  return this.vuecal.transitionDirection;
}, set(e) {
  this.vuecal.transitionDirection = e;
} }, broaderView() {
  const { enabledViews: e } = this.vuecal;
  return e[e.indexOf(this.view.id) - 1];
}, showDaySplits() {
  return this.view.id === "day" && this.hasSplits && this.options.stickySplitLabels && !this.options.minSplitWidth;
}, dnd() {
  return this.modules.dnd;
} } }, [["render", function(e, t, i, n, o, s) {
  const a = j("weekdays-headings");
  return h(), c("div", _e, [i.options.hideViewSelector ? m("", !0) : (h(), c("div", ke, [(h(!0), c(T, null, S(i.viewProps.views, (l, u) => (h(), c(T, { key: u }, [l.enabled ? (h(), c("button", { key: 0, class: b(["vuecal__view-btn", { "vuecal__view-btn--active": s.view.id === u, "vuecal__view-btn--highlighted": e.highlightedControl === u }]), type: "button", onDragenter: (r) => i.editEvents.drag && s.dnd && s.dnd.viewSelectorDragEnter(r, u, e.$data), onDragleave: (r) => i.editEvents.drag && s.dnd && s.dnd.viewSelectorDragLeave(r, u, e.$data), onClick: (r) => s.switchView(u, null, !0), "aria-label": `${l.label} view` }, f(l.label), 43, be)) : m("", !0)], 64))), 128))])), i.options.hideTitleBar ? m("", !0) : (h(), c("div", Te, [k("button", { class: b(["vuecal__arrow vuecal__arrow--prev", { "vuecal__arrow--highlighted": e.highlightedControl === "previous" }]), type: "button", onClick: t[0] || (t[0] = (...l) => s.previous && s.previous(...l)), onDragenter: t[1] || (t[1] = (l) => i.editEvents.drag && s.dnd && s.dnd.viewSelectorDragEnter(l, "previous", e.$data)), onDragleave: t[2] || (t[2] = (l) => i.editEvents.drag && s.dnd && s.dnd.viewSelectorDragLeave(l, "previous", e.$data)), "aria-label": `Previous ${s.view.id}` }, [w(e.$slots, "arrow-prev")], 42, Ee), k("div", Ce, [U(R, { name: i.options.transitions ? `slide-fade--${s.transitionDirection}` : "" }, { default: g(() => [(h(), H(de(s.broaderView ? "button" : "span"), { type: !!s.broaderView && "button", key: `${s.view.id}${s.view.startDate.toString()}`, onClick: t[3] || (t[3] = (l) => !!s.broaderView && s.switchToBroaderView()), "aria-label": !!s.broaderView && `Go to ${s.broaderView} view` }, { default: g(() => [w(e.$slots, "title")]), _: 3 }, 8, ["type", "aria-label"]))]), _: 3 }, 8, ["name"])]), i.options.todayButton ? (h(), c("button", { key: 0, class: b(["vuecal__today-btn", { "vuecal__today-btn--highlighted": e.highlightedControl === "today" }]), type: "button", onClick: t[4] || (t[4] = (...l) => s.goToToday && s.goToToday(...l)), onDragenter: t[5] || (t[5] = (l) => i.editEvents.drag && s.dnd && s.dnd.viewSelectorDragEnter(l, "today", e.$data)), onDragleave: t[6] || (t[6] = (l) => i.editEvents.drag && s.dnd && s.dnd.viewSelectorDragLeave(l, "today", e.$data)), "aria-label": "Today" }, [w(e.$slots, "today-button")], 34)) : m("", !0), k("button", { class: b(["vuecal__arrow vuecal__arrow--next", { "vuecal__arrow--highlighted": e.highlightedControl === "next" }]), type: "button", onClick: t[7] || (t[7] = (...l) => s.next && s.next(...l)), onDragenter: t[8] || (t[8] = (l) => i.editEvents.drag && s.dnd && s.dnd.viewSelectorDragEnter(l, "next", e.$data)), onDragleave: t[9] || (t[9] = (l) => i.editEvents.drag && s.dnd && s.dnd.viewSelectorDragLeave(l, "next", e.$data)), "aria-label": `Next ${s.view.id}` }, [w(e.$slots, "arrow-next")], 42, Me)])), i.viewProps.weekDaysInHeader ? (h(), H(a, { key: 2, "week-days": i.weekDays, "transition-direction": s.transitionDirection, "switch-to-narrower-view": i.switchToNarrowerView }, X({ _: 2 }, [e.$slots["weekday-heading"] ? { name: "weekday-heading", fn: g(({ heading: l, view: u }) => [w(e.$slots, "weekday-heading", { heading: l, view: u })]), key: "0" } : void 0, e.$slots["split-label"] ? { name: "split-label", fn: g(({ split: l }) => [w(e.$slots, "split-label", { split: l, view: s.view })]), key: "1" } : void 0]), 1032, ["week-days", "transition-direction", "switch-to-narrower-view"])) : m("", !0), U(R, { name: `slide-fade--${s.transitionDirection}` }, { default: g(() => [s.showDaySplits ? (h(), c("div", Se, [(h(!0), c(T, null, S(i.daySplits, (l, u) => (h(), c("div", { class: b(["day-split-header", l.class || !1]), key: u }, [w(e.$slots, "split-label", { split: l, view: s.view.id }, () => [M(f(l.label), 1)])], 2))), 128))])) : m("", !0)]), _: 3 }, 8, ["name"])]);
}]]), $e = ["draggable"], xe = { inject: ["vuecal", "utils", "modules", "view", "domEvents", "editEvents"], props: { cellFormattedDate: { type: String, default: "" }, event: { type: Object, default: () => ({}) }, cellEvents: { type: Array, default: () => [] }, overlaps: { type: Array, default: () => [] }, eventPosition: { type: Number, default: 0 }, overlapsStreak: { type: Number, default: 0 }, allDay: { type: Boolean, default: !1 } }, data: () => ({ touch: { dragThreshold: 30, startX: 0, startY: 0, dragged: !1 } }), methods: { onMouseDown(e, t = !1) {
  if ("ontouchstart" in window && !t)
    return !1;
  const { clickHoldAnEvent: i, focusAnEvent: n, resizeAnEvent: o, dragAnEvent: s } = this.domEvents;
  if (n._eid === this.event._eid && i._eid === this.event._eid)
    return !0;
  this.focusEvent(), i._eid = null, this.vuecal.editEvents.delete && this.event.deletable && (i.timeoutId = setTimeout(() => {
    o._eid || s._eid || (i._eid = this.event._eid, this.event.deleting = !0);
  }, i.timeout));
}, onMouseUp(e) {
  this.domEvents.focusAnEvent._eid !== this.event._eid || this.touch.dragged || (this.domEvents.focusAnEvent.mousedUp = !0), this.touch.dragged = !1;
}, onMouseEnter(e) {
  e.preventDefault(), this.vuecal.emitWithEvent("event-mouse-enter", this.event);
}, onMouseLeave(e) {
  e.preventDefault(), this.vuecal.emitWithEvent("event-mouse-leave", this.event);
}, onTouchMove(e) {
  if (typeof this.vuecal.onEventClick != "function")
    return;
  const { clientX: t, clientY: i } = e.touches[0], { startX: n, startY: o, dragThreshold: s } = this.touch;
  (Math.abs(t - n) > s || Math.abs(i - o) > s) && (this.touch.dragged = !0);
}, onTouchStart(e) {
  this.touch.startX = e.touches[0].clientX, this.touch.startY = e.touches[0].clientY, this.onMouseDown(e, !0);
}, onEnterKeypress(e) {
  if (typeof this.vuecal.onEventClick == "function")
    return this.vuecal.onEventClick(this.event, e);
}, onDblClick(e) {
  if (typeof this.vuecal.onEventDblclick == "function")
    return this.vuecal.onEventDblclick(this.event, e);
}, onDragStart(e) {
  this.dnd && this.dnd.eventDragStart(e, this.event);
}, onDragEnd() {
  this.dnd && this.dnd.eventDragEnd(this.event);
}, onResizeHandleMouseDown() {
  this.focusEvent(), this.domEvents.dragAnEvent._eid = null, this.domEvents.resizeAnEvent = Object.assign(this.domEvents.resizeAnEvent, { _eid: this.event._eid, start: (this.segment || this.event).start, split: this.event.split || null, segment: !!this.segment && this.utils.date.formatDateLite(this.segment.start), originalEnd: new Date((this.segment || this.event).end), originalEndTimeMinutes: this.event.endTimeMinutes }), this.event.resizing = !0;
}, deleteEvent(e = !1) {
  if ("ontouchstart" in window && !e)
    return !1;
  this.utils.event.deleteAnEvent(this.event);
}, touchDeleteEvent(e) {
  this.deleteEvent(!0);
}, cancelDeleteEvent() {
  this.event.deleting = !1;
}, focusEvent() {
  const { focusAnEvent: e } = this.domEvents, t = e._eid;
  if (t !== this.event._eid) {
    if (t) {
      const i = this.view.events.find((n) => n._eid === t);
      i && (i.focused = !1);
    }
    this.vuecal.cancelDelete(), this.vuecal.emitWithEvent("event-focus", this.event), e._eid = this.event._eid, this.event.focused = !0;
  }
} }, computed: { eventDimensions() {
  const { startTimeMinutes: e, endTimeMinutes: t } = this.segment || this.event;
  let i = e - this.vuecal.timeFrom;
  const n = Math.max(Math.round(i * this.vuecal.timeCellHeight / this.vuecal.timeStep), 0);
  i = Math.min(t, this.vuecal.timeTo) - this.vuecal.timeFrom;
  const o = Math.round(i * this.vuecal.timeCellHeight / this.vuecal.timeStep);
  return { top: n, height: Math.max(o - n, 5) };
}, eventStyles() {
  if (this.event.allDay || !this.vuecal.time || !this.event.endTimeMinutes || this.view.id === "month" || this.allDay)
    return {};
  const e = Math.min(this.overlaps.length + 1, this.overlapsStreak);
  let t = 100 / e, i = 100 / e * this.eventPosition;
  this.vuecal.minEventWidth && t < this.vuecal.minEventWidth && (t = this.vuecal.minEventWidth, i = (100 - this.vuecal.minEventWidth) / this.overlaps.length * this.eventPosition);
  const { top: n, height: o } = this.eventDimensions;
  return { top: `${n}px`, height: `${o}px`, width: `${t}%`, left: this.event.left && `${this.event.left}px` || `${i}%` };
}, eventClasses() {
  const { isFirstDay: e, isLastDay: t } = this.segment || {};
  return { [this.event.class]: !!this.event.class, "vuecal__event--focus": this.event.focused, "vuecal__event--resizing": this.event.resizing, "vuecal__event--background": this.event.background, "vuecal__event--deletable": this.event.deleting, "vuecal__event--all-day": this.event.allDay, "vuecal__event--dragging": !this.event.draggingStatic && this.event.dragging, "vuecal__event--static": this.event.dragging && this.event.draggingStatic, "vuecal__event--multiple-days": !!this.segment, "event-start": this.segment && e && !t, "event-middle": this.segment && !e && !t, "event-end": this.segment && t && !e };
}, segment() {
  return this.event.segments && this.event.segments[this.cellFormattedDate] || null;
}, draggable() {
  const { draggable: e, background: t, daysCount: i } = this.event;
  return this.vuecal.editEvents.drag && e && !t && i === 1;
}, resizable() {
  const { editEvents: e, time: t } = this.vuecal;
  return e.resize && this.event.resizable && t && !this.allDay && (!this.segment || this.segment && this.segment.isLastDay) && this.view.id !== "month";
}, dnd() {
  return this.modules.dnd;
} } }, We = ["data-split", "aria-label", "onTouchstart", "onMousedown", "onDragover", "onDrop"], He = { key: 0, class: "cell-time-labels" }, Ve = ["innerHTML"], Ae = { key: 2, class: "vuecal__cell-events" }, je = ["title"], ae = B({ inject: ["vuecal", "utils", "modules", "view", "domEvents"], components: { Event: B(xe, [["render", function(e, t, i, n, o, s) {
  return h(), c("div", { class: b(["vuecal__event", s.eventClasses]), style: $(s.eventStyles), tabindex: "0", onFocus: t[4] || (t[4] = (...a) => s.focusEvent && s.focusEvent(...a)), onKeypress: t[5] || (t[5] = Z(L((...a) => s.onEnterKeypress && s.onEnterKeypress(...a), ["stop"]), ["enter"])), onMouseenter: t[6] || (t[6] = (...a) => s.onMouseEnter && s.onMouseEnter(...a)), onMouseleave: t[7] || (t[7] = (...a) => s.onMouseLeave && s.onMouseLeave(...a)), onTouchstart: t[8] || (t[8] = L((...a) => s.onTouchStart && s.onTouchStart(...a), ["stop"])), onMousedown: t[9] || (t[9] = (a) => s.onMouseDown(a)), onMouseup: t[10] || (t[10] = (...a) => s.onMouseUp && s.onMouseUp(...a)), onTouchend: t[11] || (t[11] = (...a) => s.onMouseUp && s.onMouseUp(...a)), onTouchmove: t[12] || (t[12] = (...a) => s.onTouchMove && s.onTouchMove(...a)), onDblclick: t[13] || (t[13] = (...a) => s.onDblClick && s.onDblClick(...a)), draggable: s.draggable, onDragstart: t[14] || (t[14] = (a) => s.draggable && s.onDragStart(a)), onDragend: t[15] || (t[15] = (a) => s.draggable && s.onDragEnd()) }, [s.vuecal.editEvents.delete && i.event.deletable ? (h(), c("div", { key: 0, class: "vuecal__event-delete", onClick: t[0] || (t[0] = L((...a) => s.deleteEvent && s.deleteEvent(...a), ["stop"])), onTouchstart: t[1] || (t[1] = L((...a) => s.touchDeleteEvent && s.touchDeleteEvent(...a), ["stop"])) }, f(s.vuecal.texts.deleteEvent), 33)) : m("", !0), w(e.$slots, "event", { event: i.event, view: s.view.id }), s.resizable ? (h(), c("div", { key: 1, class: "vuecal__event-resize-handle", contenteditable: "false", onMousedown: t[2] || (t[2] = L((...a) => s.onResizeHandleMouseDown && s.onResizeHandleMouseDown(...a), ["stop", "prevent"])), onTouchstart: t[3] || (t[3] = L((...a) => s.onResizeHandleMouseDown && s.onResizeHandleMouseDown(...a), ["stop", "prevent"])) }, null, 32)) : m("", !0)], 46, $e);
}]]) }, props: { options: { type: Object, default: () => ({}) }, editEvents: { type: Object, required: !0 }, data: { type: Object, required: !0 }, cellSplits: { type: Array, default: () => [] }, minTimestamp: { type: [Number, null], default: null }, maxTimestamp: { type: [Number, null], default: null }, cellWidth: { type: [Number, Boolean], default: !1 }, allDay: { type: Boolean, default: !1 } }, data: () => ({ cellOverlaps: {}, cellOverlapsStreak: 1, timeAtCursor: null, highlighted: !1, highlightedSplit: null }), methods: { getSplitAtCursor({ target: e }) {
  let t = e.classList.contains("vuecal__cell-split") ? e : this.vuecal.findAncestor(e, "vuecal__cell-split");
  return t && (t = t.attributes["data-split"].value, parseInt(t).toString() === t.toString() && (t = parseInt(t))), t || null;
}, splitClasses(e) {
  return { "vuecal__cell-split": !0, "vuecal__cell-split--highlighted": this.highlightedSplit === e.id, [e.class]: !!e.class };
}, checkCellOverlappingEvents() {
  this.options.time && this.eventsCount && !this.splitsCount && (this.eventsCount === 1 ? (this.cellOverlaps = [], this.cellOverlapsStreak = 1) : [this.cellOverlaps, this.cellOverlapsStreak] = this.utils.event.checkCellOverlappingEvents(this.events, this.options));
}, isDOMElementAnEvent(e) {
  return this.vuecal.isDOMElementAnEvent(e);
}, selectCell(e, t = !1) {
  const i = this.splitsCount ? this.getSplitAtCursor(e) : null;
  this.utils.cell.selectCell(t, this.timeAtCursor, i), this.timeAtCursor = null;
}, onCellkeyPressEnter(e) {
  this.isSelected || this.onCellFocus(e);
  const t = this.splitsCount ? this.getSplitAtCursor(e) : null;
  this.utils.cell.keyPressEnterCell(this.timeAtCursor, t), this.timeAtCursor = null;
}, onCellFocus(e) {
  if (!this.isSelected && !this.isDisabled) {
    this.isSelected = this.data.startDate;
    const t = this.splitsCount ? this.getSplitAtCursor(e) : null, i = this.timeAtCursor || this.data.startDate;
    this.vuecal.$emit("cell-focus", t ? { date: i, split: t } : i);
  }
}, onCellMouseDown(e, t = null, i = !1) {
  if ("ontouchstart" in window && !i)
    return !1;
  this.isSelected || this.onCellFocus(e);
  const { clickHoldACell: n, focusAnEvent: o } = this.domEvents;
  this.domEvents.cancelClickEventCreation = !1, n.eventCreated = !1, this.timeAtCursor = new Date(this.data.startDate);
  const { minutes: s, cursorCoords: { y: a } } = this.vuecal.minutesAtCursor(e);
  this.timeAtCursor.setMinutes(s);
  const l = this.isDOMElementAnEvent(e.target);
  !l && o._eid && ((this.view.events.find((u) => u._eid === o._eid) || {}).focused = !1), this.editEvents.create && !l && this.setUpEventCreation(e, a);
}, setUpEventCreation(e, t) {
  if (this.options.dragToCreateEvent && ["week", "day"].includes(this.view.id)) {
    const { dragCreateAnEvent: i } = this.domEvents;
    if (i.startCursorY = t, i.split = this.splitsCount ? this.getSplitAtCursor(e) : null, i.start = this.timeAtCursor, this.options.snapToTime) {
      let n = 60 * this.timeAtCursor.getHours() + this.timeAtCursor.getMinutes();
      const o = n + this.options.snapToTime / 2;
      n = o - o % this.options.snapToTime, i.start.setHours(0, n, 0, 0);
    }
  } else
    this.options.cellClickHold && ["month", "week", "day"].includes(this.view.id) && this.setUpCellHoldTimer(e);
}, setUpCellHoldTimer(e) {
  const { clickHoldACell: t } = this.domEvents;
  t.cellId = `${this.vuecal._.uid}_${this.data.formattedDate}`, t.split = this.splitsCount ? this.getSplitAtCursor(e) : null, t.timeoutId = setTimeout(() => {
    if (t.cellId && !this.domEvents.cancelClickEventCreation) {
      const { _eid: i } = this.utils.event.createAnEvent(this.timeAtCursor, null, t.split ? { split: t.split } : {});
      t.eventCreated = i;
    }
  }, t.timeout);
}, onCellTouchStart(e, t = null) {
  this.onCellMouseDown(e, t, !0);
}, onCellClick(e) {
  this.isDOMElementAnEvent(e.target) || this.selectCell(e);
}, onCellDblClick(e) {
  const t = new Date(this.data.startDate);
  t.setMinutes(this.vuecal.minutesAtCursor(e).minutes);
  const i = this.splitsCount ? this.getSplitAtCursor(e) : null;
  this.vuecal.$emit("cell-dblclick", i ? { date: t, split: i } : t), this.options.dblclickToNavigate && this.vuecal.switchToNarrowerView();
}, onCellContextMenu(e) {
  e.stopPropagation(), e.preventDefault();
  const t = new Date(this.data.startDate), { cursorCoords: i, minutes: n } = this.vuecal.minutesAtCursor(e);
  t.setMinutes(n);
  const o = this.splitsCount ? this.getSplitAtCursor(e) : null;
  this.vuecal.$emit("cell-contextmenu", { date: t, ...i, ...o || {}, e });
} }, computed: { dnd() {
  return this.modules.dnd;
}, nowInMinutes() {
  return this.utils.date.dateToMinutes(this.vuecal.now);
}, isBeforeMinDate() {
  return this.minTimestamp !== null && this.minTimestamp > this.data.endDate.getTime();
}, isAfterMaxDate() {
  return this.maxTimestamp && this.maxTimestamp < this.data.startDate.getTime();
}, isDisabled() {
  const { disableDays: e } = this.options, { isYearsOrYearView: t } = this.vuecal;
  return !(!e.length || !e.includes(this.data.formattedDate) || t) || this.isBeforeMinDate || this.isAfterMaxDate;
}, isSelected: { get() {
  let e = !1;
  const { selectedDate: t } = this.view;
  return e = this.view.id === "years" ? t.getFullYear() === this.data.startDate.getFullYear() : this.view.id === "year" ? t.getFullYear() === this.data.startDate.getFullYear() && t.getMonth() === this.data.startDate.getMonth() : t.getTime() === this.data.startDate.getTime(), e;
}, set(e) {
  this.view.selectedDate = e, this.vuecal.$emit("update:selected-date", this.view.selectedDate);
} }, isWeekOrDayView() {
  return ["week", "day"].includes(this.view.id);
}, transitionDirection() {
  return this.vuecal.transitionDirection;
}, specialHours() {
  return this.data.specialHours.map((e) => {
    let { from: t, to: i } = e;
    return t = Math.max(t, this.options.timeFrom), i = Math.min(i, this.options.timeTo), { ...e, height: (i - t) * this.timeScale, top: (t - this.options.timeFrom) * this.timeScale };
  });
}, events() {
  const { startDate: e, endDate: t } = this.data;
  let i = [];
  if (!["years", "year"].includes(this.view.id) || this.options.eventsCountOnYearView) {
    if (i = this.view.events.slice(0), this.view.id === "month" && i.push(...this.view.outOfScopeEvents), i = i.filter((n) => this.utils.event.eventInRange(n, e, t)), this.options.showAllDayEvents && this.view.id !== "month" && (i = i.filter((n) => !!n.allDay === this.allDay)), this.options.time && this.isWeekOrDayView && !this.allDay) {
      const { timeFrom: n, timeTo: o } = this.options;
      i = i.filter((s) => {
        const a = s.daysCount > 1 && s.segments[this.data.formattedDate] || {}, l = s.daysCount === 1 && s.startTimeMinutes < o && s.endTimeMinutes > n, u = s.daysCount > 1 && a.startTimeMinutes < o && a.endTimeMinutes > n;
        return s.allDay || l || u || !1;
      });
    }
    !this.options.time || !this.isWeekOrDayView || this.options.showAllDayEvents && this.allDay || i.sort((n, o) => n.start < o.start ? -1 : 1), this.cellSplits.length || this.$nextTick(this.checkCellOverlappingEvents);
  }
  return i;
}, eventsCount() {
  return this.events.length;
}, splits() {
  return this.cellSplits.map((e, t) => {
    const i = this.events.filter((s) => s.split === e.id), [n, o] = this.utils.event.checkCellOverlappingEvents(i.filter((s) => !s.background && !s.allDay), this.options);
    return { ...e, overlaps: n, overlapsStreak: o, events: i };
  });
}, splitsCount() {
  return this.splits.length;
}, cellClasses() {
  return { [this.data.class]: !!this.data.class, "vuecal__cell--current": this.data.current, "vuecal__cell--today": this.data.today, "vuecal__cell--out-of-scope": this.data.outOfScope, "vuecal__cell--before-min": this.isDisabled && this.isBeforeMinDate, "vuecal__cell--after-max": this.isDisabled && this.isAfterMaxDate, "vuecal__cell--disabled": this.isDisabled, "vuecal__cell--selected": this.isSelected, "vuecal__cell--highlighted": this.highlighted, "vuecal__cell--has-splits": this.splitsCount, "vuecal__cell--has-events": this.eventsCount };
}, cellStyles() {
  return { ...this.cellWidth ? { width: `${this.cellWidth}%` } : {} };
}, timelineVisible() {
  const { time: e, timeTo: t } = this.options;
  return this.data.today && this.isWeekOrDayView && e && !this.allDay && this.nowInMinutes <= t;
}, todaysTimePosition() {
  if (!this.data.today || !this.options.time)
    return;
  const e = this.nowInMinutes - this.options.timeFrom;
  return Math.round(e * this.timeScale);
}, timeScale() {
  return this.options.timeCellHeight / this.options.timeStep;
} } }, [["render", function(e, t, i, n, o, s) {
  const a = j("event");
  return h(), H(ue, { class: b(["vuecal__cell", s.cellClasses]), name: `slide-fade--${s.transitionDirection}`, tag: "div", appear: i.options.transitions, style: $(s.cellStyles) }, { default: g(() => [(h(!0), c(T, null, S(s.splitsCount ? s.splits : 1, (l, u) => (h(), c("div", { class: b(["vuecal__flex vuecal__cell-content", s.splitsCount && s.splitClasses(l)]), key: i.options.transitions ? `${s.view.id}-${i.data.content}-${u}` : u, "data-split": !!s.splitsCount && l.id, column: "", tabindex: "0", "aria-label": i.data.content, onFocus: t[0] || (t[0] = (r) => s.onCellFocus(r)), onKeypress: t[1] || (t[1] = Z((r) => s.onCellkeyPressEnter(r), ["enter"])), onTouchstart: (r) => !s.isDisabled && s.onCellTouchStart(r, s.splitsCount ? l.id : null), onMousedown: (r) => !s.isDisabled && s.onCellMouseDown(r, s.splitsCount ? l.id : null), onClick: t[2] || (t[2] = (r) => !s.isDisabled && s.onCellClick(r)), onDblclick: t[3] || (t[3] = (r) => !s.isDisabled && s.onCellDblClick(r)), onContextmenu: t[4] || (t[4] = (r) => !s.isDisabled && i.options.cellContextmenu && s.onCellContextMenu(r)), onDragenter: t[5] || (t[5] = (r) => !s.isDisabled && i.editEvents.drag && s.dnd && s.dnd.cellDragEnter(r, e.$data, i.data.startDate)), onDragover: (r) => !s.isDisabled && i.editEvents.drag && s.dnd && s.dnd.cellDragOver(r, e.$data, i.data.startDate, s.splitsCount ? l.id : null), onDragleave: t[6] || (t[6] = (r) => !s.isDisabled && i.editEvents.drag && s.dnd && s.dnd.cellDragLeave(r, e.$data, i.data.startDate)), onDrop: (r) => !s.isDisabled && i.editEvents.drag && s.dnd && s.dnd.cellDragDrop(r, e.$data, i.data.startDate, s.splitsCount ? l.id : null) }, [i.options.showTimeInCells && i.options.time && s.isWeekOrDayView && !i.allDay ? (h(), c("div", He, [(h(!0), c(T, null, S(s.vuecal.timeCells, (r, d) => (h(), c("span", { class: "cell-time-label", key: d }, f(r.label), 1))), 128))])) : m("", !0), s.isWeekOrDayView && !i.allDay && s.specialHours.length ? (h(!0), c(T, { key: 1 }, S(s.specialHours, (r, d) => (h(), c("div", { class: b(["vuecal__special-hours", `vuecal__special-hours--day${r.day} ${r.class}`]), style: $(`height: ${r.height}px;top: ${r.top}px`) }, [r.label ? (h(), c("div", { key: 0, class: "special-hours-label", innerHTML: r.label }, null, 8, Ve)) : m("", !0)], 6))), 256)) : m("", !0), w(e.$slots, "cell-content", { events: s.events, selectCell: (r) => s.selectCell(r, !0), split: !!s.splitsCount && l }), s.eventsCount && (s.isWeekOrDayView || s.view.id === "month" && i.options.eventsOnMonthView) ? (h(), c("div", Ae, [(h(!0), c(T, null, S(s.splitsCount ? l.events : s.events, (r, d) => (h(), H(a, { key: d, "cell-formatted-date": i.data.formattedDate, event: r, "all-day": i.allDay, "cell-events": s.splitsCount ? l.events : s.events, overlaps: ((s.splitsCount ? l.overlaps[r._eid] : e.cellOverlaps[r._eid]) || []).overlaps, "event-position": ((s.splitsCount ? l.overlaps[r._eid] : e.cellOverlaps[r._eid]) || []).position, "overlaps-streak": s.splitsCount ? l.overlapsStreak : e.cellOverlapsStreak }, { event: g(({ event: v, view: p }) => [w(e.$slots, "event", { view: p, event: v })]), _: 2 }, 1032, ["cell-formatted-date", "event", "all-day", "cell-events", "overlaps", "event-position", "overlaps-streak"]))), 128))])) : m("", !0)], 42, We))), 128)), s.timelineVisible ? (h(), c("div", { class: "vuecal__now-line", style: $(`top: ${s.todaysTimePosition}px`), key: i.options.transitions ? `${s.view.id}-now-line` : "now-line", title: s.utils.date.formatTime(s.vuecal.now) }, null, 12, je)) : m("", !0)]), _: 3 }, 8, ["class", "name", "appear", "style"]);
}]]), Ye = { key: 0, class: "vuecal__all-day-text", style: { width: "3em" } }, Le = B({ inject: ["vuecal", "view", "editEvents"], components: { "vuecal-cell": ae }, props: { options: { type: Object, required: !0 }, cells: { type: Array, required: !0 }, label: { type: String, required: !0 }, daySplits: { type: Array, default: () => [] }, shortEvents: { type: Boolean, default: !0 }, height: { type: String, default: "" }, cellOrSplitMinWidth: { type: Number, default: null } }, computed: { hasCellOrSplitWidth() {
  return !!(this.options.minCellWidth || this.daySplits.length && this.options.minSplitWidth);
} } }, [["render", function(e, t, i, n, o, s) {
  const a = j("vuecal-cell");
  return h(), c("div", { class: "vuecal__flex vuecal__all-day", style: $(i.cellOrSplitMinWidth && { height: i.height }) }, [i.cellOrSplitMinWidth ? m("", !0) : (h(), c("div", Ye, [k("span", null, f(i.label), 1)])), k("div", { class: b(["vuecal__flex vuecal__cells", `${s.view.id}-view`]), grow: "", style: $(i.cellOrSplitMinWidth ? `min-width: ${i.cellOrSplitMinWidth}px` : "") }, [(h(!0), c(T, null, S(i.cells, (l, u) => (h(), H(a, { key: u, options: i.options, "edit-events": s.editEvents, data: l, "all-day": !0, "cell-width": i.options.hideWeekdays.length && (s.vuecal.isWeekView || s.vuecal.isMonthView) && s.vuecal.cellWidth, "min-timestamp": i.options.minTimestamp, "max-timestamp": i.options.maxTimestamp, "cell-splits": i.daySplits }, { event: g(({ event: r, view: d }) => [w(e.$slots, "event", { view: d, event: r })]), _: 2 }, 1032, ["options", "edit-events", "data", "cell-width", "min-timestamp", "max-timestamp", "cell-splits"]))), 128))], 6)], 4);
}]]), Fe = ["lang"], Be = k("i", { class: "angle" }, null, -1), Ne = k("i", { class: "angle" }, null, -1), ze = { class: "default" }, Ie = { key: 0, class: "vuecal__flex vuecal__body", grow: "" }, Pe = ["onBlur", "innerHTML"], Ue = ["innerHTML"], Re = ["innerHTML"], qe = { class: "vuecal__flex", row: "", grow: "" }, Ke = { key: 0, class: "vuecal__time-column" }, Xe = k("span", { class: "vuecal__time-cell-line" }, null, -1), Ge = { class: "vuecal__time-cell-label" }, Ze = { key: 1, class: "vuecal__flex vuecal__week-numbers", column: "" }, Je = ["wrap", "column"], Qe = ["onBlur", "innerHTML"], et = ["innerHTML"], tt = ["innerHTML"], it = ["wrap"], st = ["innerHTML"], nt = ["innerHTML"], at = { key: 2, class: "vuecal__cell-events-count" }, lt = { key: 3, class: "vuecal__no-event" }, ot = ["onBlur", "innerHTML"], rt = ["innerHTML"], dt = { key: 2, class: "vuecal__event-time" }, ut = { key: 0 }, ht = { key: 1, class: "days-to-end" }, ct = ["innerHTML"], vt = { key: 0, class: "vuecal__scrollbar-check" }, mt = [k("div", null, null, -1)], I = 1440, P = { weekDays: Array(7).fill(""), weekDaysShort: [], months: Array(12).fill(""), years: "", year: "", month: "", week: "", day: "", today: "", noEvent: "", allDay: "", deleteEvent: "", createEvent: "", dateFormat: "dddd MMMM D, YYYY", am: "am", pm: "pm" }, ie = ["years", "year", "month", "week", "day"], se = new class {
  constructor(e, t = !1) {
    W(this, "texts", {});
    W(this, "dateToMinutes", (e) => 60 * e.getHours() + e.getMinutes());
    O = this, this._texts = e, t || !Date || Date.prototype.addDays || this._initDatePrototypes();
  }
  _initDatePrototypes() {
    Date.prototype.addDays = function(e) {
      return O.addDays(this, e);
    }, Date.prototype.subtractDays = function(e) {
      return O.subtractDays(this, e);
    }, Date.prototype.addHours = function(e) {
      return O.addHours(this, e);
    }, Date.prototype.subtractHours = function(e) {
      return O.subtractHours(this, e);
    }, Date.prototype.addMinutes = function(e) {
      return O.addMinutes(this, e);
    }, Date.prototype.subtractMinutes = function(e) {
      return O.subtractMinutes(this, e);
    }, Date.prototype.getWeek = function() {
      return O.getWeek(this);
    }, Date.prototype.isToday = function() {
      return O.isToday(this);
    }, Date.prototype.isLeapYear = function() {
      return O.isLeapYear(this);
    }, Date.prototype.format = function(e = "YYYY-MM-DD") {
      return O.formatDate(this, e);
    }, Date.prototype.formatTime = function(e = "HH:mm") {
      return O.formatTime(this, e);
    };
  }
  removePrototypes() {
    delete Date.prototype.addDays, delete Date.prototype.subtractDays, delete Date.prototype.addHours, delete Date.prototype.subtractHours, delete Date.prototype.addMinutes, delete Date.prototype.subtractMinutes, delete Date.prototype.getWeek, delete Date.prototype.isToday, delete Date.prototype.isLeapYear, delete Date.prototype.format, delete Date.prototype.formatTime;
  }
  updateTexts(e) {
    this._texts = e;
  }
  _todayFormatted() {
    return ee !== new Date().getDate() && (N = new Date(), ee = N.getDate(), te = `${N.getFullYear()}-${N.getMonth()}-${N.getDate()}`), te;
  }
  addDays(e, t) {
    const i = new Date(e.valueOf());
    return i.setDate(i.getDate() + t), i;
  }
  subtractDays(e, t) {
    const i = new Date(e.valueOf());
    return i.setDate(i.getDate() - t), i;
  }
  addHours(e, t) {
    const i = new Date(e.valueOf());
    return i.setHours(i.getHours() + t), i;
  }
  subtractHours(e, t) {
    const i = new Date(e.valueOf());
    return i.setHours(i.getHours() - t), i;
  }
  addMinutes(e, t) {
    const i = new Date(e.valueOf());
    return i.setMinutes(i.getMinutes() + t), i;
  }
  subtractMinutes(e, t) {
    const i = new Date(e.valueOf());
    return i.setMinutes(i.getMinutes() - t), i;
  }
  getWeek(e) {
    const t = new Date(Date.UTC(e.getFullYear(), e.getMonth(), e.getDate())), i = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - i);
    const n = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    return Math.ceil(((t - n) / 864e5 + 1) / 7);
  }
  isToday(e) {
    return `${e.getFullYear()}-${e.getMonth()}-${e.getDate()}` === this._todayFormatted();
  }
  isLeapYear(e) {
    const t = e.getFullYear();
    return !(t % 400) || t % 100 && !(t % 4);
  }
  getPreviousFirstDayOfWeek(e = null, t) {
    const i = e && new Date(e.valueOf()) || new Date(), n = t ? 7 : 6;
    return i.setDate(i.getDate() - (i.getDay() + n) % 7), i;
  }
  stringToDate(e) {
    return e instanceof Date ? e : (e.length === 10 && (e += " 00:00"), new Date(e.replace(/-/g, "/")));
  }
  countDays(e, t) {
    typeof e == "string" && (e = e.replace(/-/g, "/")), typeof t == "string" && (t = t.replace(/-/g, "/")), e = new Date(e).setHours(0, 0, 0, 0), t = new Date(t).setHours(0, 0, 1, 0);
    const i = 60 * (new Date(t).getTimezoneOffset() - new Date(e).getTimezoneOffset()) * 1e3;
    return Math.ceil((t - e - i) / 864e5);
  }
  datesInSameTimeStep(e, t, i) {
    return Math.abs(e.getTime() - t.getTime()) <= 60 * i * 1e3;
  }
  formatDate(e, t = "YYYY-MM-DD", i = null) {
    if (i || (i = this._texts), t || (t = "YYYY-MM-DD"), t === "YYYY-MM-DD")
      return this.formatDateLite(e);
    z = {}, F = {};
    const n = { YYYY: () => this._hydrateDateObject(e, i).YYYY, YY: () => this._hydrateDateObject(e, i).YY(), M: () => this._hydrateDateObject(e, i).M, MM: () => this._hydrateDateObject(e, i).MM(), MMM: () => this._hydrateDateObject(e, i).MMM(), MMMM: () => this._hydrateDateObject(e, i).MMMM(), MMMMG: () => this._hydrateDateObject(e, i).MMMMG(), D: () => this._hydrateDateObject(e, i).D, DD: () => this._hydrateDateObject(e, i).DD(), S: () => this._hydrateDateObject(e, i).S(), d: () => this._hydrateDateObject(e, i).d, dd: () => this._hydrateDateObject(e, i).dd(), ddd: () => this._hydrateDateObject(e, i).ddd(), dddd: () => this._hydrateDateObject(e, i).dddd(), HH: () => this._hydrateTimeObject(e, i).HH, H: () => this._hydrateTimeObject(e, i).H, hh: () => this._hydrateTimeObject(e, i).hh, h: () => this._hydrateTimeObject(e, i).h, am: () => this._hydrateTimeObject(e, i).am, AM: () => this._hydrateTimeObject(e, i).AM, mm: () => this._hydrateTimeObject(e, i).mm, m: () => this._hydrateTimeObject(e, i).m };
    return t.replace(/(\{[a-zA-Z]+\}|[a-zA-Z]+)/g, (o, s) => {
      const a = n[s.replace(/\{|\}/g, "")];
      return a !== void 0 ? a() : s;
    });
  }
  formatDateLite(e) {
    const t = e.getMonth() + 1, i = e.getDate();
    return `${e.getFullYear()}-${t < 10 ? "0" : ""}${t}-${i < 10 ? "0" : ""}${i}`;
  }
  formatTime(e, t = "HH:mm", i = null, n = !1) {
    let o = !1;
    if (n) {
      const [l, u, r] = [e.getHours(), e.getMinutes(), e.getSeconds()];
      l + u + r === 141 && (o = !0);
    }
    if (e instanceof Date && t === "HH:mm")
      return o ? "24:00" : this.formatTimeLite(e);
    F = {}, i || (i = this._texts);
    const s = this._hydrateTimeObject(e, i), a = t.replace(/(\{[a-zA-Z]+\}|[a-zA-Z]+)/g, (l, u) => {
      const r = s[u.replace(/\{|\}/g, "")];
      return r !== void 0 ? r : u;
    });
    return o ? a.replace("23:59", "24:00") : a;
  }
  formatTimeLite(e) {
    const t = e.getHours(), i = e.getMinutes();
    return `${(t < 10 ? "0" : "") + t}:${(i < 10 ? "0" : "") + i}`;
  }
  _nth(e) {
    if (e > 3 && e < 21)
      return "th";
    switch (e % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }
  _hydrateDateObject(e, t) {
    if (z.D)
      return z;
    const i = e.getFullYear(), n = e.getMonth() + 1, o = e.getDate(), s = (e.getDay() - 1 + 7) % 7;
    return z = { YYYY: i, YY: () => i.toString().substring(2), M: n, MM: () => (n < 10 ? "0" : "") + n, MMM: () => t.months[n - 1].substring(0, 3), MMMM: () => t.months[n - 1], MMMMG: () => (t.monthsGenitive || t.months)[n - 1], D: o, DD: () => (o < 10 ? "0" : "") + o, S: () => this._nth(o), d: s + 1, dd: () => t.weekDays[s][0], ddd: () => t.weekDays[s].substr(0, 3), dddd: () => t.weekDays[s] }, z;
  }
  _hydrateTimeObject(e, t) {
    if (F.am)
      return F;
    let i, n;
    e instanceof Date ? (i = e.getHours(), n = e.getMinutes()) : (i = Math.floor(e / 60), n = Math.floor(e % 60));
    const o = i % 12 ? i % 12 : 12, s = (t || { am: "am", pm: "pm" })[i === 24 || i < 12 ? "am" : "pm"];
    return F = { H: i, h: o, HH: (i < 10 ? "0" : "") + i, hh: (o < 10 ? "0" : "") + o, am: s, AM: s.toUpperCase(), m: n, mm: (n < 10 ? "0" : "") + n }, F;
  }
}(P), pt = { name: "vue-cal", components: { "vuecal-cell": ae, "vuecal-header": Oe, WeekdaysHeadings: ne, AllDayBar: Le }, provide() {
  return { vuecal: this, utils: this.utils, modules: this.modules, previous: this.previous, next: this.next, switchView: this.switchView, updateSelectedDate: this.updateSelectedDate, editEvents: this.editEvents, view: this.view, domEvents: this.domEvents };
}, props: { activeView: { type: String, default: "week" }, allDayBarHeight: { type: [String, Number], default: "25px" }, cellClickHold: { type: Boolean, default: !0 }, cellContextmenu: { type: Boolean, default: !1 }, clickToNavigate: { type: Boolean, default: !1 }, dblclickToNavigate: { type: Boolean, default: !0 }, disableDatePrototypes: { type: Boolean, default: !1 }, disableDays: { type: Array, default: () => [] }, disableViews: { type: Array, default: () => [] }, dragToCreateEvent: { type: Boolean, default: !0 }, dragToCreateThreshold: { type: Number, default: 15 }, editableEvents: { type: [Boolean, Object], default: !1 }, events: { type: Array, default: () => [] }, eventsCountOnYearView: { type: Boolean, default: !1 }, eventsOnMonthView: { type: [Boolean, String], default: !1 }, hideBody: { type: Boolean, default: !1 }, hideTitleBar: { type: Boolean, default: !1 }, hideViewSelector: { type: Boolean, default: !1 }, hideWeekdays: { type: Array, default: () => [] }, hideWeekends: { type: Boolean, default: !1 }, locale: { type: [String, Object], default: "en" }, maxDate: { type: [String, Date], default: "" }, minCellWidth: { type: Number, default: 0 }, minDate: { type: [String, Date], default: "" }, minEventWidth: { type: Number, default: 0 }, minSplitWidth: { type: Number, default: 0 }, onEventClick: { type: [Function, null], default: null }, onEventCreate: { type: [Function, null], default: null }, onEventDblclick: { type: [Function, null], default: null }, overlapsPerTimeStep: { type: Boolean, default: !1 }, resizeX: { type: Boolean, default: !1 }, selectedDate: { type: [String, Date], default: "" }, showAllDayEvents: { type: [Boolean, String], default: !1 }, showTimeInCells: { type: Boolean, default: !1 }, showWeekNumbers: { type: [Boolean, String], default: !1 }, snapToTime: { type: Number, default: 0 }, small: { type: Boolean, default: !1 }, specialHours: { type: Object, default: () => ({}) }, splitDays: { type: Array, default: () => [] }, startWeekOnSunday: { type: Boolean, default: !1 }, stickySplitLabels: { type: Boolean, default: !1 }, time: { type: Boolean, default: !0 }, timeCellHeight: { type: Number, default: 40 }, timeFormat: { type: String, default: "" }, timeFrom: { type: Number, default: 0 }, timeStep: { type: Number, default: 60 }, timeTo: { type: Number, default: I }, todayButton: { type: Boolean, default: !1 }, transitions: { type: Boolean, default: !0 }, twelveHour: { type: Boolean, default: !1 }, watchRealTime: { type: Boolean, default: !1 }, xsmall: { type: Boolean, default: !1 } }, data() {
  return { ready: !1, texts: { ...P }, utils: { date: !!this.disableDatePrototypes && se.removePrototypes() || se, cell: null, event: null }, modules: { dnd: null }, cellsEl: null, view: { id: "", title: "", startDate: null, endDate: null, firstCellDate: null, lastCellDate: null, selectedDate: null, events: [] }, eventIdIncrement: 1, now: new Date(), timeTickerIds: [null, null], domEvents: { resizeAnEvent: { _eid: null, start: null, split: null, segment: null, originalEndTimeMinutes: 0, originalEnd: null, end: null, startCell: null, endCell: null }, dragAnEvent: { _eid: null }, dragCreateAnEvent: { startCursorY: null, start: null, split: null, event: null }, focusAnEvent: { _eid: null, mousedUp: !1 }, clickHoldAnEvent: { _eid: null, timeout: 1200, timeoutId: null }, dblTapACell: { taps: 0, timeout: 500 }, clickHoldACell: { cellId: null, split: null, timeout: 1200, timeoutId: null, eventCreated: !1 }, cancelClickEventCreation: !1 }, mutableEvents: [], transitionDirection: "right" };
}, methods: { async loadLocale(e) {
  if (typeof this.locale == "object")
    return this.texts = Object.assign({}, P, e), void this.utils.date.updateTexts(this.texts);
  if (this.locale === "en") {
    const t = await import("./i18n/en.es.js");
    this.texts = Object.assign({}, P, t);
  } else
    ((t, i) => {
      const n = t[i];
      return n ? typeof n == "function" ? n() : Promise.resolve(n) : new Promise((o, s) => {
        (typeof queueMicrotask == "function" ? queueMicrotask : setTimeout)(s.bind(null, new Error("Unknown variable dynamic import: " + i)));
      });
    })(Object.assign({ "./i18n/ar.json": () => import("./i18n/ar.es.js"), "./i18n/bg.json": () => import("./i18n/bg.es.js"), "./i18n/bn.json": () => import("./i18n/bn.es.js"), "./i18n/bs.json": () => import("./i18n/bs.es.js"), "./i18n/ca.json": () => import("./i18n/ca.es.js"), "./i18n/cs.json": () => import("./i18n/cs.es.js"), "./i18n/da.json": () => import("./i18n/da.es.js"), "./i18n/de.json": () => import("./i18n/de.es.js"), "./i18n/el.json": () => import("./i18n/el.es.js"), "./i18n/en.json": () => import("./i18n/en.es.js"), "./i18n/es.json": () => import("./i18n/es.es.js"), "./i18n/et.json": () => import("./i18n/et.es.js"), "./i18n/fa.json": () => import("./i18n/fa.es.js"), "./i18n/fr.json": () => import("./i18n/fr.es.js"), "./i18n/he.json": () => import("./i18n/he.es.js"), "./i18n/hr.json": () => import("./i18n/hr.es.js"), "./i18n/hu.json": () => import("./i18n/hu.es.js"), "./i18n/id.json": () => import("./i18n/id.es.js"), "./i18n/is.json": () => import("./i18n/is.es.js"), "./i18n/it.json": () => import("./i18n/it.es.js"), "./i18n/ja.json": () => import("./i18n/ja.es.js"), "./i18n/ka.json": () => import("./i18n/ka.es.js"), "./i18n/ko.json": () => import("./i18n/ko.es.js"), "./i18n/lt.json": () => import("./i18n/lt.es.js"), "./i18n/mn.json": () => import("./i18n/mn.es.js"), "./i18n/nl.json": () => import("./i18n/nl.es.js"), "./i18n/no.json": () => import("./i18n/no.es.js"), "./i18n/pl.json": () => import("./i18n/pl.es.js"), "./i18n/pt-br.json": () => import("./i18n/pt-br.es.js"), "./i18n/ro.json": () => import("./i18n/ro.es.js"), "./i18n/ru.json": () => import("./i18n/ru.es.js"), "./i18n/sk.json": () => import("./i18n/sk.es.js"), "./i18n/sl.json": () => import("./i18n/sl.es.js"), "./i18n/sq.json": () => import("./i18n/sq.es.js"), "./i18n/sr.json": () => import("./i18n/sr.es.js"), "./i18n/sv.json": () => import("./i18n/sv.es.js"), "./i18n/tr.json": () => import("./i18n/tr.es.js"), "./i18n/uk.json": () => import("./i18n/uk.es.js"), "./i18n/vi.json": () => import("./i18n/vi.es.js"), "./i18n/zh-cn.json": () => import("./i18n/zh-cn.es.js"), "./i18n/zh-hk.json": () => import("./i18n/zh-hk.es.js") }), `./i18n/${e}.json`).then((t) => {
      this.texts = Object.assign({}, P, t.default), this.utils.date.updateTexts(this.texts);
    });
}, loadDragAndDrop() {
  import("./drag-and-drop.es.js").then((e) => {
    const { DragAndDrop: t } = e;
    this.modules.dnd = new t(this);
  }).catch(() => console.warn("Vue Cal: Missing drag & drop module."));
}, validateView(e) {
  return ie.includes(e) || (console.error(`Vue Cal: invalid active-view parameter provided: "${e}".
A valid view must be one of: ${ie.join(", ")}.`), e = "week"), this.enabledViews.includes(e) || (console.warn(`Vue Cal: the provided active-view "${e}" is disabled. Using the "${this.enabledViews[0]}" view instead.`), e = this.enabledViews[0]), e;
}, switchToNarrowerView(e = null) {
  this.transitionDirection = "right";
  const t = this.enabledViews[this.enabledViews.indexOf(this.view.id) + 1];
  t && this.switchView(t, e);
}, switchView(e, t = null, i = !1) {
  e = this.validateView(e);
  const n = this.utils.date, o = this.view.startDate && this.view.startDate.getTime();
  if (this.transitions && i) {
    if (this.view.id === e)
      return;
    const l = this.enabledViews;
    this.transitionDirection = l.indexOf(this.view.id) > l.indexOf(e) ? "left" : "right";
  }
  const s = this.view.id;
  switch (this.view.events = [], this.view.id = e, this.view.firstCellDate = null, this.view.lastCellDate = null, t || (t = this.view.selectedDate || this.view.startDate), e) {
    case "years":
      this.view.startDate = new Date(25 * Math.floor(t.getFullYear() / 25) || 2e3, 0, 1), this.view.endDate = new Date(this.view.startDate.getFullYear() + 25, 0, 1), this.view.endDate.setSeconds(-1);
      break;
    case "year":
      this.view.startDate = new Date(t.getFullYear(), 0, 1), this.view.endDate = new Date(t.getFullYear() + 1, 0, 1), this.view.endDate.setSeconds(-1);
      break;
    case "month": {
      this.view.startDate = new Date(t.getFullYear(), t.getMonth(), 1), this.view.endDate = new Date(t.getFullYear(), t.getMonth() + 1, 1), this.view.endDate.setSeconds(-1);
      let l = new Date(this.view.startDate);
      if (l.getDay() !== (this.startWeekOnSunday ? 0 : 1) && (l = n.getPreviousFirstDayOfWeek(l, this.startWeekOnSunday)), this.view.firstCellDate = l, this.view.lastCellDate = n.addDays(l, 41), this.view.lastCellDate.setHours(23, 59, 59, 0), this.hideWeekends) {
        if ([0, 6].includes(this.view.firstCellDate.getDay())) {
          const u = this.view.firstCellDate.getDay() !== 6 || this.startWeekOnSunday ? 1 : 2;
          this.view.firstCellDate = n.addDays(this.view.firstCellDate, u);
        }
        if ([0, 6].includes(this.view.startDate.getDay())) {
          const u = this.view.startDate.getDay() === 6 ? 2 : 1;
          this.view.startDate = n.addDays(this.view.startDate, u);
        }
        if ([0, 6].includes(this.view.lastCellDate.getDay())) {
          const u = this.view.lastCellDate.getDay() !== 0 || this.startWeekOnSunday ? 1 : 2;
          this.view.lastCellDate = n.subtractDays(this.view.lastCellDate, u);
        }
        if ([0, 6].includes(this.view.endDate.getDay())) {
          const u = this.view.endDate.getDay() === 0 ? 2 : 1;
          this.view.endDate = n.subtractDays(this.view.endDate, u);
        }
      }
      break;
    }
    case "week": {
      t = n.getPreviousFirstDayOfWeek(t, this.startWeekOnSunday);
      const l = this.hideWeekends ? 5 : 7;
      this.view.startDate = this.hideWeekends && this.startWeekOnSunday ? n.addDays(t, 1) : t, this.view.startDate.setHours(0, 0, 0, 0), this.view.endDate = n.addDays(t, l), this.view.endDate.setSeconds(-1);
      break;
    }
    case "day":
      this.view.startDate = t, this.view.startDate.setHours(0, 0, 0, 0), this.view.endDate = new Date(t), this.view.endDate.setHours(23, 59, 59, 0);
  }
  this.addEventsToView();
  const a = this.view.startDate && this.view.startDate.getTime();
  if ((s !== e || a !== o) && (this.$emit("update:activeView", e), this.ready)) {
    const l = this.view.startDate, u = { view: e, startDate: l, endDate: this.view.endDate, ...this.isMonthView ? { firstCellDate: this.view.firstCellDate, lastCellDate: this.view.lastCellDate, outOfScopeEvents: this.view.outOfScopeEvents.map(this.cleanupEvent) } : {}, events: this.view.events.map(this.cleanupEvent), ...this.isWeekView ? { week: n.getWeek(this.startWeekOnSunday ? n.addDays(l, 1) : l) } : {} };
    this.$emit("view-change", u);
  }
}, previous() {
  this.previousNext(!1);
}, next() {
  this.previousNext();
}, previousNext(e = !0) {
  const t = this.utils.date;
  this.transitionDirection = e ? "right" : "left";
  const i = e ? 1 : -1;
  let n = null;
  const { startDate: o, id: s } = this.view;
  switch (s) {
    case "years":
      n = new Date(o.getFullYear() + 25 * i, 0, 1);
      break;
    case "year":
      n = new Date(o.getFullYear() + 1 * i, 1, 1);
      break;
    case "month":
      n = new Date(o.getFullYear(), o.getMonth() + 1 * i, 1);
      break;
    case "week":
      n = t[e ? "addDays" : "subtractDays"](t.getPreviousFirstDayOfWeek(o, this.startWeekOnSunday), 7);
      break;
    case "day":
      n = t[e ? "addDays" : "subtractDays"](o, 1);
      const a = n.getDay(), l = this.startWeekOnSunday ? a : (a || 7) - 1;
      if (this.weekDays[l].hide) {
        const u = this.weekDays.map((d, v) => ({ ...d, i: v }));
        let r = 0;
        e ? ([...u.slice(l), ...u].find((d) => (r++, !d.hide)).i, r--) : [...u, ...u.slice(0, l)].reverse().find((d) => (r++, !d.hide)).i, n = t[e ? "addDays" : "subtractDays"](n, r);
      }
  }
  n && this.switchView(s, n);
}, addEventsToView(e = []) {
  const t = this.utils.event, { startDate: i, endDate: n, firstCellDate: o, lastCellDate: s } = this.view;
  if (e.length || (this.view.events = []), !(e = e.length ? e : [...this.mutableEvents]) || this.isYearsOrYearView && !this.eventsCountOnYearView)
    return;
  let a = e.filter((l) => t.eventInRange(l, i, n));
  this.isYearsOrYearView || this.isMonthView && !this.eventsOnMonthView || (a = a.map((l) => l.daysCount > 1 ? t.createEventSegments(l, o || i, s || n) : l)), this.view.events.push(...a), this.isMonthView && (this.view.outOfScopeEvents = [], e.forEach((l) => {
    (t.eventInRange(l, o, i) || t.eventInRange(l, n, s)) && (this.view.events.some((u) => u._eid === l._eid) || this.view.outOfScopeEvents.push(l));
  }));
}, findAncestor(e, t) {
  for (; (e = e.parentElement) && !e.classList.contains(t); )
    ;
  return e;
}, isDOMElementAnEvent(e) {
  return e.classList.contains("vuecal__event") || this.findAncestor(e, "vuecal__event");
}, onMouseMove(e) {
  const { resizeAnEvent: t, dragAnEvent: i, dragCreateAnEvent: n } = this.domEvents;
  (t._eid !== null || i._eid !== null || n.start) && (e.preventDefault(), t._eid ? this.eventResizing(e) : this.dragToCreateEvent && n.start && this.eventDragCreation(e));
}, onMouseUp(e) {
  const { focusAnEvent: t, resizeAnEvent: i, clickHoldAnEvent: n, clickHoldACell: o, dragCreateAnEvent: s } = this.domEvents, { _eid: a } = n, { _eid: l } = i;
  let u = !1;
  const { event: r, start: d } = s, v = this.isDOMElementAnEvent(e.target), p = t.mousedUp;
  if (t.mousedUp = !1, v && (this.domEvents.cancelClickEventCreation = !0), o.eventCreated)
    return;
  if (l) {
    const { originalEnd: _, originalEndTimeMinutes: x, endTimeMinutes: V } = i, C = this.view.events.find((Y) => Y._eid === i._eid);
    if (u = V && V !== x, C && C.end.getTime() !== _.getTime()) {
      const Y = this.mutableEvents.find((le) => le._eid === i._eid);
      Y.endTimeMinutes = C.endTimeMinutes, Y.end = C.end;
      const A = this.cleanupEvent(C), G = { ...this.cleanupEvent(C), end: _, endTimeMinutes: C.originalEndTimeMinutes };
      this.$emit("event-duration-change", { event: A, oldDate: i.originalEnd, originalEvent: G }), this.$emit("event-change", { event: A, originalEvent: G });
    }
    C && (C.resizing = !1), i._eid = null, i.start = null, i.split = null, i.segment = null, i.originalEndTimeMinutes = null, i.originalEnd = null, i.endTimeMinutes = null, i.startCell = null, i.endCell = null;
  } else
    d && (r && (this.emitWithEvent("event-drag-create", r), s.event.resizing = !1), s.start = null, s.split = null, s.event = null);
  v || l || this.unfocusEvent(), n.timeoutId && !a && (clearTimeout(n.timeoutId), n.timeoutId = null), o.timeoutId && (clearTimeout(o.timeoutId), o.timeoutId = null);
  const E = typeof this.onEventClick == "function";
  if (p && !u && !a && !r && E) {
    let _ = this.view.events.find((x) => x._eid === t._eid);
    return !_ && this.isMonthView && (_ = this.view.outOfScopeEvents.find((x) => x._eid === t._eid)), _ && this.onEventClick(_, e);
  }
}, onKeyUp(e) {
  e.keyCode === 27 && this.cancelDelete();
}, eventResizing(e) {
  const { resizeAnEvent: t } = this.domEvents, i = this.view.events.find((r) => r._eid === t._eid) || { segments: {} }, { minutes: n, cursorCoords: o } = this.minutesAtCursor(e), s = i.segments && i.segments[t.segment], { date: a, event: l } = this.utils, u = Math.max(n, this.timeFrom + 1, (s || i).startTimeMinutes + 1);
  if (i.endTimeMinutes = t.endTimeMinutes = u, this.snapToTime) {
    const r = i.endTimeMinutes + this.snapToTime / 2;
    i.endTimeMinutes = r - r % this.snapToTime;
  }
  if (s && (s.endTimeMinutes = i.endTimeMinutes), i.end.setHours(0, i.endTimeMinutes, i.endTimeMinutes === I ? -1 : 0, 0), this.resizeX && this.isWeekView) {
    i.daysCount = a.countDays(i.start, i.end);
    const r = this.cellsEl, d = r.offsetWidth / r.childElementCount, v = Math.floor(o.x / d);
    if (t.startCell === null && (t.startCell = v - (i.daysCount - 1)), t.endCell !== v) {
      t.endCell = v;
      const p = a.addDays(i.start, v - t.startCell), E = Math.max(a.countDays(i.start, p), 1);
      if (E !== i.daysCount) {
        let _ = null;
        _ = E > i.daysCount ? l.addEventSegment(i) : l.removeEventSegment(i), t.segment = _, i.endTimeMinutes += 1e-3;
      }
    }
  }
  this.$emit("event-resizing", { _eid: i._eid, end: i.end, endTimeMinutes: i.endTimeMinutes });
}, eventDragCreation(e) {
  const { dragCreateAnEvent: t } = this.domEvents, { start: i, startCursorY: n, split: o } = t, s = new Date(i), { minutes: a, cursorCoords: { y: l } } = this.minutesAtCursor(e);
  if (t.event || !(Math.abs(n - l) < this.dragToCreateThreshold))
    if (t.event) {
      if (s.setHours(0, a, a === I ? -1 : 0, 0), this.snapToTime) {
        let d = 60 * s.getHours() + s.getMinutes();
        const v = d + this.snapToTime / 2;
        d = v - v % this.snapToTime, s.setHours(0, d, 0, 0);
      }
      const u = i < s, { event: r } = t;
      r.start = u ? i : s, r.end = u ? s : i, r.startTimeMinutes = 60 * r.start.getHours() + r.start.getMinutes(), r.endTimeMinutes = 60 * r.end.getHours() + r.end.getMinutes();
    } else {
      if (t.event = this.utils.event.createAnEvent(i, 1, { split: o }), !t.event)
        return t.start = null, t.split = null, void (t.event = null);
      t.event.resizing = !0;
    }
}, unfocusEvent() {
  const { focusAnEvent: e, clickHoldAnEvent: t } = this.domEvents, i = this.view.events.find((n) => n._eid === (e._eid || t._eid));
  e._eid = null, t._eid = null, i && (i.focused = !1, i.deleting = !1);
}, cancelDelete() {
  const { clickHoldAnEvent: e } = this.domEvents;
  if (e._eid) {
    const t = this.view.events.find((i) => i._eid === e._eid);
    t && (t.deleting = !1), e._eid = null, e.timeoutId = null;
  }
}, onEventTitleBlur(e, t) {
  if (t.title === e.target.innerHTML)
    return;
  const i = t.title;
  t.title = e.target.innerHTML;
  const n = this.cleanupEvent(t);
  this.$emit("event-title-change", { event: n, oldTitle: i }), this.$emit("event-change", { event: n, originalEvent: { ...n, title: i } });
}, updateMutableEvents() {
  const e = this.utils.date;
  this.mutableEvents = [], this.events.forEach((t) => {
    const i = typeof t.start == "string" ? e.stringToDate(t.start) : t.start, n = e.formatDateLite(i), o = e.dateToMinutes(i);
    let s = null;
    typeof t.end == "string" && t.end.includes("24:00") ? (s = new Date(t.end.replace(" 24:00", "")), s.setHours(23, 59, 59, 0)) : s = typeof t.end == "string" ? e.stringToDate(t.end) : t.end;
    let a = e.formatDateLite(s), l = e.dateToMinutes(s);
    l && l !== I || (!this.time || typeof t.end == "string" && t.end.length === 10 ? s.setHours(23, 59, 59, 0) : s.setSeconds(s.getSeconds() - 1), a = e.formatDateLite(s), l = I);
    const u = n !== a;
    t = Object.assign({ ...this.utils.event.eventDefaults }, t, { _eid: `${this._.uid}_${this.eventIdIncrement++}`, segments: u ? {} : null, start: i, startTimeMinutes: o, end: s, endTimeMinutes: l, daysCount: u ? e.countDays(i, s) : 1, class: t.class }), this.mutableEvents.push(t);
  });
}, minutesAtCursor(e) {
  return this.utils.cell.minutesAtCursor(e);
}, createEvent(e, t, i = {}) {
  return this.utils.event.createAnEvent(e, t, i);
}, cleanupEvent(e) {
  return e = { ...e }, ["segments", "deletable", "deleting", "titleEditable", "resizable", "resizing", "draggable", "dragging", "draggingStatic", "focused"].forEach((t) => {
    t in e && delete e[t];
  }), e.repeat || delete e.repeat, e;
}, emitWithEvent(e, t) {
  this.$emit(e, this.cleanupEvent(t));
}, updateSelectedDate(e) {
  if ((e = e && typeof e == "string" ? this.utils.date.stringToDate(e) : new Date(e)) && e instanceof Date) {
    const { selectedDate: t } = this.view;
    t && (this.transitionDirection = t.getTime() > e.getTime() ? "left" : "right"), e.setHours(0, 0, 0, 0), t && t.getTime() === e.getTime() || (this.view.selectedDate = e), this.switchView(this.view.id);
  }
  this.$emit("update:selected-date", this.view.selectedDate);
}, getWeekNumber(e) {
  const t = this.utils.date, i = this.firstCellDateWeekNumber + e, n = this.startWeekOnSunday ? 1 : 0;
  return i > 52 ? t.getWeek(t.addDays(this.view.firstCellDate, 7 * e + n)) : i;
}, timeTick() {
  this.now = new Date(), this.timeTickerIds[1] = setTimeout(this.timeTick, 6e4);
}, updateDateTexts() {
  this.utils.date.updateTexts(this.texts);
}, alignWithScrollbar() {
  if (document.getElementById("vuecal-align-with-scrollbar"))
    return;
  const e = this.$refs.vuecal.getElementsByClassName("vuecal__scrollbar-check")[0], t = e.offsetWidth - e.children[0].offsetWidth;
  if (t) {
    const i = document.createElement("style");
    i.id = "vuecal-align-with-scrollbar", i.type = "text/css", i.innerHTML = `.vuecal--view-with-time .vuecal__weekdays-headings,.vuecal--view-with-time .vuecal__all-day {padding-right: ${t}px}`, document.head.appendChild(i);
  }
}, cellOrSplitHasEvents: (e, t = null) => e.length && (!t && e.length || t && e.some((i) => i.split === t.id)) }, created() {
  this.utils.cell = new he(this), this.utils.event = new ce(this, this.utils.date), this.loadLocale(this.locale), this.editEvents.drag && this.loadDragAndDrop(), this.updateMutableEvents(this.events), this.view.id = this.currentView, this.selectedDate ? this.updateSelectedDate(this.selectedDate) : (this.view.selectedDate = new Date(), this.switchView(this.currentView)), this.time && this.watchRealTime && (this.timeTickerIds[0] = setTimeout(this.timeTick, 1e3 * (60 - this.now.getSeconds())));
}, mounted() {
  const e = this.utils.date, t = "ontouchstart" in window, { resize: i, drag: n, create: o, delete: s, title: a } = this.editEvents, l = this.onEventClick && typeof this.onEventClick == "function";
  (i || n || o || s || a || l) && window.addEventListener(t ? "touchend" : "mouseup", this.onMouseUp), (i || n || o && this.dragToCreateEvent) && window.addEventListener(t ? "touchmove" : "mousemove", this.onMouseMove, { passive: !1 }), a && window.addEventListener("keyup", this.onKeyUp), t && (this.$refs.vuecal.oncontextmenu = function(d) {
    d.preventDefault(), d.stopPropagation();
  }), this.hideBody || this.alignWithScrollbar();
  const u = this.view.startDate, r = { view: this.view.id, startDate: u, endDate: this.view.endDate, ...this.isMonthView ? { firstCellDate: this.view.firstCellDate, lastCellDate: this.view.lastCellDate } : {}, events: this.view.events.map(this.cleanupEvent), ...this.isWeekView ? { week: e.getWeek(this.startWeekOnSunday ? e.addDays(u, 1) : u) } : {} };
  this.$emit("ready", r), this.ready = !0;
}, beforeUnmount() {
  const e = "ontouchstart" in window;
  window.removeEventListener(e ? "touchmove" : "mousemove", this.onMouseMove, { passive: !1 }), window.removeEventListener(e ? "touchend" : "mouseup", this.onMouseUp), window.removeEventListener("keyup", this.onKeyUp), this.timeTickerIds[0] && clearTimeout(this.timeTickerIds[0]), this.timeTickerIds[1] && clearTimeout(this.timeTickerIds[1]), this.timeTickerIds = [null, null];
}, computed: { editEvents() {
  return this.editableEvents && typeof this.editableEvents == "object" ? { title: !!this.editableEvents.title, drag: !!this.editableEvents.drag, resize: !!this.editableEvents.resize, create: !!this.editableEvents.create, delete: !!this.editableEvents.delete } : { title: !!this.editableEvents, drag: !!this.editableEvents, resize: !!this.editableEvents, create: !!this.editableEvents, delete: !!this.editableEvents };
}, views() {
  return { years: { label: this.texts.years, enabled: !this.disableViews.includes("years") }, year: { label: this.texts.year, enabled: !this.disableViews.includes("year") }, month: { label: this.texts.month, enabled: !this.disableViews.includes("month") }, week: { label: this.texts.week, enabled: !this.disableViews.includes("week") }, day: { label: this.texts.day, enabled: !this.disableViews.includes("day") } };
}, currentView() {
  return this.validateView(this.activeView);
}, enabledViews() {
  return Object.keys(this.views).filter((e) => this.views[e].enabled);
}, hasTimeColumn() {
  return this.time && this.isWeekOrDayView;
}, isShortMonthView() {
  return this.isMonthView && this.eventsOnMonthView === "short";
}, firstCellDateWeekNumber() {
  const e = this.utils.date, t = this.view.firstCellDate;
  return e.getWeek(this.startWeekOnSunday ? e.addDays(t, 1) : t);
}, timeCells() {
  const e = [];
  for (let t = this.timeFrom, i = this.timeTo; t < i; t += this.timeStep)
    e.push({ hours: Math.floor(t / 60), minutes: t % 60, label: this.utils.date.formatTime(t, this.TimeFormat), value: t });
  return e;
}, TimeFormat() {
  return this.timeFormat || (this.twelveHour ? "h:mm{am}" : "HH:mm");
}, daySplits() {
  return (this.splitDays.filter((e) => !e.hide) || []).map((e, t) => ({ ...e, id: e.id || t + 1 }));
}, hasSplits() {
  return this.daySplits.length && this.isWeekOrDayView;
}, hasShortEvents() {
  return this.showAllDayEvents === "short";
}, cellOrSplitMinWidth() {
  let e = null;
  return this.hasSplits && this.minSplitWidth ? e = this.visibleDaysCount * this.minSplitWidth * this.daySplits.length : this.minCellWidth && this.isWeekView && (e = this.visibleDaysCount * this.minCellWidth), e;
}, allDayBar() {
  let e = this.allDayBarHeight || null;
  return e && !isNaN(e) && (e += "px"), { cells: this.viewCells, options: this.$props, label: this.texts.allDay, shortEvents: this.hasShortEvents, daySplits: this.hasSplits && this.daySplits || [], cellOrSplitMinWidth: this.cellOrSplitMinWidth, height: e };
}, minTimestamp() {
  let e = null;
  return this.minDate && typeof this.minDate == "string" ? e = this.utils.date.stringToDate(this.minDate) : this.minDate && this.minDate instanceof Date && (e = this.minDate), e ? e.getTime() : null;
}, maxTimestamp() {
  let e = null;
  return this.maxDate && typeof this.maxDate == "string" ? e = this.utils.date.stringToDate(this.maxDate) : this.maxDate && this.minDate instanceof Date && (e = this.maxDate), e ? e.getTime() : null;
}, weekDays() {
  let { weekDays: e, weekDaysShort: t = [] } = this.texts;
  return e = e.slice(0).map((i, n) => ({ label: i, ...t.length ? { short: t[n] } : {}, hide: this.hideWeekends && n >= 5 || this.hideWeekdays.length && this.hideWeekdays.includes(n + 1) })), this.startWeekOnSunday && e.unshift(e.pop()), e;
}, weekDaysInHeader() {
  return this.isMonthView || this.isWeekView && !this.minCellWidth && !(this.hasSplits && this.minSplitWidth);
}, months() {
  return this.texts.months.map((e) => ({ label: e }));
}, specialDayHours() {
  return this.specialHours && Object.keys(this.specialHours).length ? Array(7).fill("").map((e, t) => {
    let i = this.specialHours[t + 1] || [];
    return Array.isArray(i) || (i = [i]), e = [], i.forEach(({ from: n, to: o, class: s, label: a }, l) => {
      e[l] = { day: t + 1, from: [null, void 0].includes(n) ? null : 1 * n, to: [null, void 0].includes(o) ? null : 1 * o, class: s || "", label: a || "" };
    }), e;
  }) : {};
}, viewTitle() {
  const e = this.utils.date;
  let t = "";
  const i = this.view.startDate, n = i.getFullYear(), o = i.getMonth();
  switch (this.view.id) {
    case "years":
      t = this.texts.years;
      break;
    case "year":
      t = n;
      break;
    case "month":
      t = `${this.months[o].label} ${n}`;
      break;
    case "week": {
      const s = this.view.endDate, a = i.getFullYear();
      let l = this.texts.months[i.getMonth()];
      this.xsmall && (l = l.substring(0, 3));
      let u = `${l} ${a}`;
      if (s.getMonth() !== i.getMonth()) {
        const r = s.getFullYear();
        let d = this.texts.months[s.getMonth()];
        this.xsmall && (d = d.substring(0, 3)), u = a === r ? `${l} - ${d} ${a}` : this.small ? `${l.substring(0, 3)} ${a} - ${d.substring(0, 3)} ${r}` : `${l} ${a} - ${d} ${r}`;
      }
      t = `${this.texts.week} ${e.getWeek(this.startWeekOnSunday ? e.addDays(i, 1) : i)} (${u})`;
      break;
    }
    case "day":
      t = this.utils.date.formatDate(i, this.texts.dateFormat, this.texts);
  }
  return t;
}, viewCells() {
  const e = this.utils.date;
  let t = [], i = null, n = !1;
  this.watchRealTime || (this.now = new Date());
  const o = this.now;
  switch (this.view.id) {
    case "years":
      i = this.view.startDate.getFullYear(), t = Array.apply(null, Array(25)).map((s, a) => {
        const l = new Date(i + a, 0, 1), u = new Date(i + a + 1, 0, 1);
        return u.setSeconds(-1), { startDate: l, formattedDate: e.formatDateLite(l), endDate: u, content: i + a, current: i + a === o.getFullYear() };
      });
      break;
    case "year":
      i = this.view.startDate.getFullYear(), t = Array.apply(null, Array(12)).map((s, a) => {
        const l = new Date(i, a, 1), u = new Date(i, a + 1, 1);
        return u.setSeconds(-1), { startDate: l, formattedDate: e.formatDateLite(l), endDate: u, content: this.xsmall ? this.months[a].label.substr(0, 3) : this.months[a].label, current: a === o.getMonth() && i === o.getFullYear() };
      });
      break;
    case "month": {
      const s = this.view.startDate.getMonth(), a = new Date(this.view.firstCellDate);
      n = !1, t = Array.apply(null, Array(42)).map((l, u) => {
        const r = e.addDays(a, u), d = new Date(r);
        d.setHours(23, 59, 59, 0);
        const v = !n && e.isToday(r) && !n++;
        return { startDate: r, formattedDate: e.formatDateLite(r), endDate: d, content: r.getDate(), today: v, outOfScope: r.getMonth() !== s, class: `vuecal__cell--day${r.getDay() || 7}` };
      }), (this.hideWeekends || this.hideWeekdays.length) && (t = t.filter((l) => {
        const u = l.startDate.getDay() || 7;
        return !(this.hideWeekends && u >= 6 || this.hideWeekdays.length && this.hideWeekdays.includes(u));
      }));
      break;
    }
    case "week": {
      n = !1;
      const s = this.view.startDate, a = this.weekDays;
      t = a.map((l, u) => {
        const r = e.addDays(s, this.startWeekOnSunday ? u - 1 : u), d = new Date(r);
        d.setHours(23, 59, 59, 0);
        const v = (r.getDay() || 7) - 1;
        return { startDate: r, formattedDate: e.formatDateLite(r), endDate: d, today: !n && e.isToday(r) && !n++, specialHours: this.specialDayHours[v] || [] };
      }).filter((l, u) => !a[u].hide);
      break;
    }
    case "day": {
      const s = this.view.startDate, a = new Date(this.view.startDate);
      a.setHours(23, 59, 59, 0);
      const l = (s.getDay() || 7) - 1;
      t = [{ startDate: s, formattedDate: e.formatDateLite(s), endDate: a, today: e.isToday(s), specialHours: this.specialDayHours[l] || [] }];
      break;
    }
  }
  return t;
}, visibleDaysCount() {
  return this.isDayView ? 1 : 7 - this.weekDays.reduce((e, t) => e + t.hide, 0);
}, cellWidth() {
  return 100 / this.visibleDaysCount;
}, cssClasses() {
  const { resizeAnEvent: e, dragAnEvent: t, dragCreateAnEvent: i } = this.domEvents;
  return { [`vuecal--${this.view.id}-view`]: !0, [`vuecal--${this.locale}`]: this.locale, "vuecal--no-time": !this.time, "vuecal--view-with-time": this.hasTimeColumn, "vuecal--week-numbers": this.showWeekNumbers && this.isMonthView, "vuecal--twelve-hour": this.twelveHour, "vuecal--click-to-navigate": this.clickToNavigate, "vuecal--hide-weekends": this.hideWeekends, "vuecal--split-days": this.hasSplits, "vuecal--sticky-split-labels": this.hasSplits && this.stickySplitLabels, "vuecal--overflow-x": this.minCellWidth && this.isWeekView || this.hasSplits && this.minSplitWidth, "vuecal--small": this.small, "vuecal--xsmall": this.xsmall, "vuecal--resizing-event": e._eid, "vuecal--drag-creating-event": i.event, "vuecal--dragging-event": t._eid, "vuecal--events-on-month-view": this.eventsOnMonthView, "vuecal--short-events": this.isMonthView && this.eventsOnMonthView === "short", "vuecal--has-touch": typeof window < "u" && "ontouchstart" in window };
}, isYearsOrYearView() {
  return ["years", "year"].includes(this.view.id);
}, isYearsView() {
  return this.view.id === "years";
}, isYearView() {
  return this.view.id === "year";
}, isMonthView() {
  return this.view.id === "month";
}, isWeekOrDayView() {
  return ["week", "day"].includes(this.view.id);
}, isWeekView() {
  return this.view.id === "week";
}, isDayView() {
  return this.view.id === "day";
} }, watch: { events: { handler(e, t) {
  this.updateMutableEvents(e), this.addEventsToView();
}, deep: !0 }, locale(e) {
  this.loadLocale(e);
}, selectedDate(e) {
  this.updateSelectedDate(e);
}, activeView(e) {
  this.switchView(e);
} } }, Dt = B(pt, [["render", function(e, t, i, n, o, s) {
  const a = j("vuecal-header"), l = j("all-day-bar"), u = j("weekdays-headings"), r = j("vuecal-cell");
  return h(), c("div", { class: b(["vuecal__flex vuecal", s.cssClasses]), column: "", ref: "vuecal", lang: i.locale }, [U(a, { options: e.$props, "edit-events": s.editEvents, "view-props": { views: s.views, weekDaysInHeader: s.weekDaysInHeader }, "week-days": s.weekDays, "has-splits": s.hasSplits, "day-splits": s.daySplits, "switch-to-narrower-view": s.switchToNarrowerView }, X({ "arrow-prev": g(() => [w(e.$slots, "arrow-prev", {}, () => [M("\xA0"), Be, M("\xA0")])]), "arrow-next": g(() => [w(e.$slots, "arrow-next", {}, () => [M("\xA0"), Ne, M("\xA0")])]), "today-button": g(() => [w(e.$slots, "today-button", {}, () => [k("span", ze, f(o.texts.today), 1)])]), title: g(() => [w(e.$slots, "title", { title: s.viewTitle, view: o.view }, () => [M(f(s.viewTitle), 1)])]), _: 2 }, [e.$slots["weekday-heading"] ? { name: "weekday-heading", fn: g(({ heading: d, view: v }) => [w(e.$slots, "weekday-heading", { heading: d, view: v })]), key: "0" } : void 0, e.$slots["split-label"] ? { name: "split-label", fn: g(({ split: d }) => [w(e.$slots, "split-label", { split: d, view: o.view.id })]), key: "1" } : void 0]), 1032, ["options", "edit-events", "view-props", "week-days", "has-splits", "day-splits", "switch-to-narrower-view"]), i.hideBody ? m("", !0) : (h(), c("div", Ie, [U(R, { name: `slide-fade--${o.transitionDirection}`, appear: i.transitions }, { default: g(() => [(h(), c("div", { class: "vuecal__flex", style: { "min-width": "100%" }, key: !!i.transitions && o.view.id, column: "" }, [i.showAllDayEvents && s.hasTimeColumn && (!s.cellOrSplitMinWidth || s.isDayView && !i.minSplitWidth) ? (h(), H(l, J(Q({ key: 0 }, s.allDayBar)), { event: g(({ event: d, view: v }) => [w(e.$slots, "event", { view: v, event: d }, () => [s.editEvents.title && d.titleEditable ? (h(), c("div", { key: 0, class: "vuecal__event-title vuecal__event-title--edit", contenteditable: "", onBlur: (p) => s.onEventTitleBlur(p, d), innerHTML: d.title }, null, 40, Pe)) : d.title ? (h(), c("div", { key: 1, class: "vuecal__event-title", innerHTML: d.title }, null, 8, Ue)) : m("", !0), !d.content || s.hasShortEvents || s.isShortMonthView ? m("", !0) : (h(), c("div", { key: 2, class: "vuecal__event-content", innerHTML: d.content }, null, 8, Re))])]), _: 3 }, 16)) : m("", !0), k("div", { class: b(["vuecal__bg", { vuecal__flex: !s.hasTimeColumn }]), column: "" }, [k("div", qe, [s.hasTimeColumn ? (h(), c("div", Ke, [i.showAllDayEvents && s.cellOrSplitMinWidth && (!s.isDayView || i.minSplitWidth) ? (h(), c("div", { key: 0, class: "vuecal__all-day-text", style: $({ height: s.allDayBar.height }) }, [k("span", null, f(o.texts.allDay), 1)], 4)) : m("", !0), (h(!0), c(T, null, S(s.timeCells, (d, v) => (h(), c("div", { class: "vuecal__time-cell", key: v, style: $(`height: ${i.timeCellHeight}px`) }, [w(e.$slots, "time-cell", { hours: d.hours, minutes: d.minutes }, () => [Xe, k("span", Ge, f(d.label), 1)])], 4))), 128))])) : m("", !0), i.showWeekNumbers && s.isMonthView ? (h(), c("div", Ze, [(h(), c(T, null, S(6, (d) => k("div", { class: "vuecal__flex vuecal__week-number-cell", key: d, grow: "" }, [w(e.$slots, "week-number-cell", { week: s.getWeekNumber(d - 1) }, () => [M(f(s.getWeekNumber(d - 1)), 1)])])), 64))])) : m("", !0), k("div", { class: b(["vuecal__flex vuecal__cells", `${o.view.id}-view`]), grow: "", wrap: !s.cellOrSplitMinWidth || !s.isWeekView, column: !!s.cellOrSplitMinWidth }, [s.cellOrSplitMinWidth && s.isWeekView ? (h(), H(u, { key: 0, "transition-direction": o.transitionDirection, "week-days": s.weekDays, "switch-to-narrower-view": s.switchToNarrowerView, style: $(s.cellOrSplitMinWidth ? `min-width: ${s.cellOrSplitMinWidth}px` : "") }, X({ _: 2 }, [e.$slots["weekday-heading"] ? { name: "weekday-heading", fn: g(({ heading: d, view: v }) => [w(e.$slots, "weekday-heading", { heading: d, view: v })]), key: "0" } : void 0, e.$slots["split-label"] ? { name: "split-label", fn: g(({ split: d }) => [w(e.$slots, "split-label", { split: d, view: o.view.id })]), key: "1" } : void 0]), 1032, ["transition-direction", "week-days", "switch-to-narrower-view", "style"])) : s.hasSplits && i.stickySplitLabels && i.minSplitWidth ? (h(), c("div", { key: 1, class: "vuecal__flex vuecal__split-days-headers", style: $(s.cellOrSplitMinWidth ? `min-width: ${s.cellOrSplitMinWidth}px` : "") }, [(h(!0), c(T, null, S(s.daySplits, (d, v) => (h(), c("div", { class: b(["day-split-header", d.class || !1]), key: v }, [w(e.$slots, "split-label", { split: d, view: o.view.id }, () => [M(f(d.label), 1)])], 2))), 128))], 4)) : m("", !0), i.showAllDayEvents && s.hasTimeColumn && (s.isWeekView && s.cellOrSplitMinWidth || s.isDayView && s.hasSplits && i.minSplitWidth) ? (h(), H(l, J(Q({ key: 2 }, s.allDayBar)), { event: g(({ event: d, view: v }) => [w(e.$slots, "event", { view: v, event: d }, () => [s.editEvents.title && d.titleEditable ? (h(), c("div", { key: 0, class: "vuecal__event-title vuecal__event-title--edit", contenteditable: "", onBlur: (p) => s.onEventTitleBlur(p, d), innerHTML: d.title }, null, 40, Qe)) : d.title ? (h(), c("div", { key: 1, class: "vuecal__event-title", innerHTML: d.title }, null, 8, et)) : m("", !0), !d.content || s.hasShortEvents || s.isShortMonthView ? m("", !0) : (h(), c("div", { key: 2, class: "vuecal__event-content", innerHTML: d.content }, null, 8, tt))])]), _: 3 }, 16)) : m("", !0), k("div", { class: "vuecal__flex", ref: (d) => o.cellsEl = d, grow: "", wrap: !s.cellOrSplitMinWidth || !s.isWeekView, style: $(s.cellOrSplitMinWidth ? `min-width: ${s.cellOrSplitMinWidth}px` : "") }, [(h(!0), c(T, null, S(s.viewCells, (d, v) => (h(), H(r, { key: v, options: e.$props, "edit-events": s.editEvents, data: d, "cell-width": i.hideWeekdays.length && (s.isWeekView || s.isMonthView) && s.cellWidth, "min-timestamp": s.minTimestamp, "max-timestamp": s.maxTimestamp, "cell-splits": s.hasSplits && s.daySplits || [] }, { "cell-content": g(({ events: p, split: E, selectCell: _ }) => [w(e.$slots, "cell-content", { cell: d, view: o.view, goNarrower: _, events: p }, () => [E && !i.stickySplitLabels ? (h(), c("div", { key: 0, class: "split-label", innerHTML: E.label }, null, 8, st)) : m("", !0), d.content ? (h(), c("div", { key: 1, class: "vuecal__cell-date", innerHTML: d.content }, null, 8, nt)) : m("", !0), (s.isMonthView && !i.eventsOnMonthView || s.isYearsOrYearView && i.eventsCountOnYearView) && p.length ? (h(), c("div", at, [w(e.$slots, "events-count", { view: o.view, events: p }, () => [M(f(p.length), 1)])])) : m("", !0), !s.cellOrSplitHasEvents(p, E) && s.isWeekOrDayView ? (h(), c("div", lt, [w(e.$slots, "no-event", {}, () => [M(f(o.texts.noEvent), 1)])])) : m("", !0)])]), event: g(({ event: p, view: E }) => [w(e.$slots, "event", { view: E, event: p }, () => [s.editEvents.title && p.titleEditable ? (h(), c("div", { key: 0, class: "vuecal__event-title vuecal__event-title--edit", contenteditable: "", onBlur: (_) => s.onEventTitleBlur(_, p), innerHTML: p.title }, null, 40, ot)) : p.title ? (h(), c("div", { key: 1, class: "vuecal__event-title", innerHTML: p.title }, null, 8, rt)) : m("", !0), !i.time || p.allDay || s.isMonthView && (p.allDay || i.showAllDayEvents === "short") || s.isShortMonthView ? m("", !0) : (h(), c("div", dt, [M(f(o.utils.date.formatTime(p.start, s.TimeFormat)), 1), p.endTimeMinutes ? (h(), c("span", ut, "\xA0- " + f(o.utils.date.formatTime(p.end, s.TimeFormat, null, !0)), 1)) : m("", !0), p.daysCount > 1 && (p.segments[d.formattedDate] || {}).isFirstDay ? (h(), c("small", ht, "\xA0+" + f(p.daysCount - 1) + f((o.texts.day[0] || "").toLowerCase()), 1)) : m("", !0)])), !p.content || s.isMonthView && p.allDay && i.showAllDayEvents === "short" || s.isShortMonthView ? m("", !0) : (h(), c("div", { key: 3, class: "vuecal__event-content", innerHTML: p.content }, null, 8, ct))])]), "no-event": g(() => [w(e.$slots, "no-event", {}, () => [M(f(o.texts.noEvent), 1)])]), _: 2 }, 1032, ["options", "edit-events", "data", "cell-width", "min-timestamp", "max-timestamp", "cell-splits"]))), 128))], 12, it)], 10, Je)])], 2)]))]), _: 3 }, 8, ["name", "appear"]), o.ready ? m("", !0) : (h(), c("div", vt, mt))]))], 10, Fe);
}]]);
export {
  Dt as default
};
