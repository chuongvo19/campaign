export class InappMessageInfo {
  // template_id: number;
  name: string;
  description: string;
  createdBy: number | null;
  constructor(
    // template_id: number,
    name: string,
    description: string,
    createdBy: number | null
  ) {
    // this.template_id = template_id;
    this.name = name;
    this.description = description;
    this.createdBy = createdBy;
  }
}

export class InappMessage extends InappMessageInfo {
  config: InappMessageContent;
  constructor(content: any) {
    super("", "", null);
    this.config = content;
  }
}

export interface InappMessageContent {
  [key: string]: any;
}

export interface DevicePreview {
  code: string | null;
  deviceOs: string;
  id: number;
  image: string | null;
  name: string;
  radius: number | null;
  scale: number | null;
  deviceWidth: number; // Chiều rộng thiết bị
  deviceHeight: number; // Chiều cao thiết bị
  deviceScreenWidth: number; // Chiều rộng màn hình thiết bị
  deviceScreenHeight: number; // Chiều cao màn hình thiết bị
  deviceScreenPadding: string; // chiều cao thanh trạng thái / navigation
  isDefault: boolean;
}

export interface DetailFont {
  name: string;
  code: string;
}

export interface DetailChart {
  day: string;
  totalConverted: number;
  totalDelivered: number;
  totalDismissed: number;
  totalDisplayed: number;
  totalInAppSent: number;
}

export interface DetailPhoneInApp {
  phone: string;
  isCMSent: boolean;
  isCMSentSuccess: boolean;
  isInAppSent: boolean;
  isInAppSentSuccess: boolean;
  isDelivered: boolean;
  isDisplayed: boolean;
  isDismissed: boolean;
  isConverted: boolean;
  sentSuccessDate: number;
}

export interface DetailCampaign {
  campaignId: string;
  name: string;
}

export interface DetailWorkFlow {
  day: string;
  totalCMSent: number;
  totalCMSentSuccess: number;
  totalCMFail: number;
  totalInAppSent: number;
  totalInAppSentSuccess: number;
  totalInAppSentFail: number;
  totalDelivered: number;
  totalDisplayed: number;
  totalDismissed: number;
  totalConverted: number;
}

export interface DetailPhoneInAppObj {
  searchText: string;
  page: number;
  pageSize: number;
  inAppMessageId: number;
}

export interface DetailInsert {
  content: string;
  contentDraft: string;
  createdBy: number;
  createdDate: number;
  description: string;
  id: number;
  lastModifiedBy: number;
  lastModifiedDate: number;
  name: string;
  status: number;
  template: number;
}

export interface DetailSave {
  id: number;
  templateId: number;
  type: number;
  createdBy: number;
  config: string;
}

export interface DetailSaveDraft {
  id: number;
  templateId: number;
  name: string;
  description: string;
  createdBy: number;
  config: string;
  type: number;
}

export interface Step {
  currentStep: number;
  isNextStep: boolean;
}

export interface DetailTemplate {
  id: number;
  content: string | null;
  image: string | null;
  name: string;
  type: string;
}

export interface DetailDataTree {
  actionClickOutside: boolean;
  background: string;
  cards: any;
  devicePreviewId: number;
  displayCardsType: number;
  expand: boolean;
  opacity: number;
  overlay: string;
  templateId: number;
}
