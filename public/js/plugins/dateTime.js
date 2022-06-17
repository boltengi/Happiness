const dateTime = function(selector, options){
  $(selector).dateTime(options);
}
$.dateTime = function($ele, options){
  const day = new Date();
  this.$ele = $ele;
  this.defaultDays = 'last7day';
  this.options = {
    dateFormat: "YYYY.mm.dd",
    timeFormat: 'HH:ii:ss',
    position: 'bottom',
    viewMonths: false,
    today: false,
    timeSeconds: true,
    timeStepMinutes: 1,
    timeStepSeconds: 1,
    // dateEnd: new Date(`${day.getFullYear()}.${(day.getMonth() + 1)}.${day.getDate()} 23:59:59`).getTime(),
    preventMaxDayCallback: function(){}
  }
  this.init(options);
}
$.dateTime.count = 0;
$.dateTime.prototype.init = function(options){
  this.options = $.extend(true, {}, this.options, options);
  this.firstDate = this.$ele.find('[data-first-date]').data('firstDate');
  this.maxday = this.$ele.data('maxday') || this.options.maxday;
  this.initElement();
  this.eleId = 'uiTime' + $.dateTime.count++;
  this.$ele.attr('id', this.eleId);
  this.initDateTimePicker();
  this.initEvent();

}
$.dateTime.prototype.initElement = function(){
  this.fromInput = ".datepicker-from .tail-datetime-field";
  this.toInput = ".datepicker-to .tail-datetime-field";
  this.$fromInput = this.$ele.find(".datepicker-from .tail-datetime-field");
  this.$toInput = this.$ele.find(".datepicker-to .tail-datetime-field");
  this.$btnTimeChoice = this.$ele.find('.btn-time-choice');
  this.$btnSave = this.$ele.find('.btn-save');
}
$.dateTime.prototype.dateTimePicker = function(selectorString, options){
  const thisOptions = $.extend({}, this.options, options);
  return tail.DateTime('#' + this.eleId + ' ' + selectorString, thisOptions);
}
$.dateTime.prototype.initDateTimePicker = function(){
  this.datepickerFrom = this.dateTimePicker(this.fromInput);
  this.datepickerTo = this.dateTimePicker(this.toInput, {dateStart: this.datepickerFrom.select});
  this.datepickerFrom.config({dateEnd: this.datepickerTo.select});
}
$.dateTime.prototype.initEvent = function(){
  const self = this;
  this.$btnTimeChoice.on('click', function(){
    const thisChoice = $(this).data('rel');
    self.selectChoice(thisChoice);
  });

  function clickFrom(self){
    const fromDate = self.datepickerFrom.select;
    const toDateStart = fromDate;

    if(self.maxday){
      self.$fromInput.removeClass('is-error');
      const fromDateM = moment(self.datepickerFrom.select);
      const toDateM = moment(self.datepickerTo.select);

      let isMaxOver = Math.abs(fromDateM.diff(toDateM, 'days')) > self.maxday;
      if(isMaxOver) {
        self.$fromInput.val('').addClass('is-error');
        self.options.preventMaxDayCallback('from', self);
      }
    }

    self.datepickerTo.config({dateStart: toDateStart})
    self.datepickerTo.on('change', function(){
      clickTo(self);
    });
  }

  function clickTo(self){
    const toDate = self.datepickerTo.select;
    const fromDateEnd = toDate;

    if(self.maxday){
      self.$toInput.removeClass('is-error');
      const fromDateM = moment(self.datepickerFrom.select);
      const toDateM = moment(self.datepickerTo.select);

      let isMaxOver = Math.abs(fromDateM.diff(toDateM, 'days')) > self.maxday;
      if(isMaxOver) {
        self.$toInput.val('').addClass('is-error');
        self.options.preventMaxDayCallback('to', self);
      }
    }
    self.datepickerFrom.config({dateEnd: fromDateEnd});
    self.datepickerFrom.on('change', function(){
      clickFrom(self);
    });
  }

  this.datepickerFrom.on('change', function(){
    clickFrom(self);
  });

  this.datepickerTo.on('change', function(){
    clickTo(self);
  });
}
$.dateTime.prototype.setFrom = function(day){
  if(day == '') return this.$fromInput.val('');
  const fromDate = [String(day.get('year')), String(day.get('month')), String(day.get('date'))];
  const fromTime = [0,0,0];
  this.datepickerFrom.selectDate(...fromDate);
  this.datepickerFrom.selectTime(...fromTime);
}
$.dateTime.prototype.setTo = function(day){
  if(day == '') return this.$toInput.val('');
  const toDate = [day];
  const toTime = [23,59,59];
  this.datepickerTo.selectDate(...toDate);
  this.datepickerTo.selectTime(...toTime);
}
$.dateTime.prototype.choice = {
  today: function(){
    const today = new Date();
    const to2day = moment(today);

    this.setFrom(to2day);
    this.setTo(today);
  },
  yesterday: function(){
    const today = new Date();
    const _yesterday = new Date(today.setDate(today.getDate() - 1));
    const yesterday = moment(_yesterday);

    this.setFrom(yesterday);
    this.setTo(_yesterday);
  },
  last7day: function(){
    const today = new Date();
    const before7day = moment(today).add(-6, 'days');

    this.setFrom(before7day);
    this.setTo(today);
  },
  last30day: function(){
    const today = new Date();
    const before30day = moment(today).add(-29, 'days');

    this.setFrom(before30day);
    this.setTo(today);
  },
  last365day: function(){
    const today = new Date();
    const before365day = moment(today).add(-364, 'days');

    this.setFrom(before365day);
    this.setTo(today);
  },
  all: function(){
    const today = new Date();
    const initDay = this.firstDate;
    const all = moment(initDay);

    this.setFrom(all);
    this.setTo(today);
  },
  thisweek: function(){
    const today = new Date();
    const thisweekFrom = moment(today).day(1);

    this.setFrom(thisweekFrom);
    this.setTo(today);
  },
  thismonth: function(){
    const today = new Date();
    const thismonthFrom = moment(today).date(1);

    this.setFrom(thismonthFrom);
    this.setTo(today);
  },
  empty: function(){
    const from = '';
    const to = '';

    this.setFrom(from);
    this.setTo(to);
  }
}
$.dateTime.prototype.selectChoice = function(thisChoice){
  if (!this.choice[thisChoice]) return;
  this.choice[thisChoice].call(this);
}
$.fn.dateTime = function(options){
  return this.each(function(){
    if ($(this).data('dateTime')) return;
    const instance = new $.dateTime($(this), options);
    $(this).data('dateTime', instance);
  });
}
