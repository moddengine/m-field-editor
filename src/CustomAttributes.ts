export interface ICustomAttributeList {
    [typeId: string]: {
      [attrName: string]:
        | ICustomAttribute
        | ICustomSelectAttribute
        | ICustomTextAttribute;
    };
  }
  
  export interface IBaseAttribute {
    label: string;
    hint: string;
  }
  
  /**
   * Text box
   */
  export interface ICustomTextAttribute extends IBaseAttribute {
    type: 'text';
    rule?: Array<
      | IFieldRuleRequired
      | IFieldRuleDate
      | IFieldRuleDateTime
      | IFieldRuleEmail
      | IFieldRuleInteger
      | IFieldRulePhone
    >;
  }
  
  /**
   * HTML Wysiwyg edtior (eg CKEditor)
   */
  export interface ICustomHtmlAttribute extends IBaseAttribute {
    type: 'html';
    rule?: Array<IFieldRuleRequired | IFieldRuleHtml>;
  }
  
  /**
   * Other custom fields (checkbox/text area)
   */
  export interface ICustomAttribute extends IBaseAttribute {
    type: 'textarea' | 'checkbox';
    rule?: IFieldRuleRequired[];
  }
  
  /**
   * Multiple choice fields
   * select = drop down list,
   * multiselect = select multiple items from list
   */
  export interface ICustomSelectAttribute extends IBaseAttribute {
    type: 'select' | 'multiselect';
    choices: string[];
    rules: IFieldRuleRequired[];
  }
  
  /**
   *  Field value is required
   */
  type IFieldRuleRequired = ['required'];
  
  /**
   *  Field only accepts whole numbers (integers)
   */
  type IFieldRuleInteger = ['integer'];
  
  /**
   *  Field only accepts dates (and datepicker will be shown)
   */
  type IFieldRuleDate = ['date'];
  
  /**
   *  Field only accepts date time (and date + time picker will be shown)
   */
  type IFieldRuleDateTime = ['datetime'];
  
  /**
   *  Field only accepts email addresses
   */
  type IFieldRuleEmail = ['email'];
  
  /**
   *  Field only accepts phone numbers
   */
  type IFieldRulePhone = ['phone'];
  
  /**
   * Field accepts html (with simple only a subset of html, etc strong,em,ul,li,etc)
   */
  type IFieldRuleHtml = ['html'] | ['html', 'simple'];
  