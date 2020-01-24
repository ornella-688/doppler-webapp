import {
  DopplerApiClient,
  Subscriber,
  CampaignDeliveryCollection,
  SubscriberCollection,
} from './doppler-api-client';
import { SubscriberList } from './shopify-client';
import { ResultWithoutExpectedErrors } from '../doppler-types';
import { timeout } from '../utils';

const listExist = {
  success: true,
  value: {
    name: 'Shopify Contacto',
    id: 27311899,
    amountSubscribers: 3,
    state: 1,
  },
};

// To test when list doesn't exist
// const listNotExists = { success: false, error: 'Error' };

const subscriber = {
  email: 'test@fromdoppler.com',
  fields: [
    {
      name: 'FIRSTNAME',
      value: 'Manuel',
      predefined: true,
      private: false,
      readonly: true,
      type: 'string',
    },
    {
      name: 'LASTNAME',
      value: 'di Rago',
      predefined: true,
      private: false,
      readonly: true,
      type: 'string',
    },
  ],
  unsubscribedDate: '2019-11-27T18:05:40.847Z',
  unsubscriptionType: 'hardBounce',
  manualUnsubscriptionReason: 'administrative',
  unsubscriptionComment: 'test',
  status: 'active',
  score: 2,
};

const getDeliveryStatus = (statusNumber: number) => {
  switch (statusNumber) {
    case 1:
      return 'opened';
    case 2:
      return 'softBounced';
    case 3:
      return 'hardBounced';
    default:
      return 'notOpened';
  }
};

const campaignDeliveryItems = [...Array(100)].map((_, index) => {
  return {
    campaignId: index,
    campaignName: 'Campaña estacional de primavera',
    campaignSubject: '¿Como sacarle provecho a la primavera?',
    deliveryStatus: getDeliveryStatus(Math.round(Math.random() * (5 - 1) + 1)),
    clicksCount: Math.round(Math.random() * (100 - 1) + 1),
    links: [
      {
        href: 'http://dopplerfilesint.fromdoppler.net/Users/50018/Campaigns/33850437/33850437.png',
        description: 'get preview',
        rel: '/docs/rels/get-campaign-preview',
      },
    ],
  };
});

const subscriberCollection = {
  items: [
    {
      email: 'test@fromdoppler.com',
      fields: [
        {
          name: 'FIRSTNAME',
          value: 'Manuel',
          predefined: true,
          private: false,
          readonly: true,
          type: 'string',
        },
        {
          name: 'LASTNAME',
          value: 'di Rago',
          predefined: true,
          private: false,
          readonly: true,
          type: 'string',
        },
      ],
      unsubscribedDate: '2019-11-27T18:05:40.847Z',
      unsubscriptionType: 'hardBounce',
      manualUnsubscriptionReason: 'administrative',
      unsubscriptionComment: 'test',
      status: 'active',
      score: 0,
    },
    {
      email: 'pepe@fromdoppler.com',
      fields: [
        {
          name: 'FIRSTNAME',
          value: 'Pepe',
          predefined: true,
          private: false,
          readonly: true,
          type: 'string',
        },
        {
          name: 'LASTNAME',
          value: 'Gonzales',
          predefined: true,
          private: false,
          readonly: true,
          type: 'string',
        },
      ],
      unsubscribedDate: '',
      unsubscriptionType: '',
      manualUnsubscriptionReason: '',
      unsubscriptionComment: '',
      status: 'inactive',
      score: 1,
    },
  ],
  currentPage: 0,
  itemsCount: 2,
  pagesCount: 1,
};

export class HardcodedDopplerApiClient implements DopplerApiClient {
  public async getListData(
    idList: number,
    apikey: string,
  ): Promise<ResultWithoutExpectedErrors<SubscriberList>> {
    console.log('getApiListData');
    await timeout(1500);
    return listExist;
    // return listNotExists;
  }

  public async getSubscriber(
    email: string,
    apikey: string,
  ): Promise<ResultWithoutExpectedErrors<Subscriber>> {
    console.log('getApiSubscriber');
    await timeout(1500);

    return {
      success: true,
      value: subscriber,
    };

    // return {
    //   success: false,
    //   error: new Error('Dummy error'),
    // };
  }

  public async getSubscriberSentCampaigns(
    email: string,
    campaignsPerPage: number,
    currentPage: number,
  ): Promise<ResultWithoutExpectedErrors<CampaignDeliveryCollection>> {
    console.log('getSubscriberSentCampaigns', email, campaignsPerPage, currentPage);
    await timeout(1500);

    let pagesSubArray = [];

    if (campaignsPerPage) {
      const indexStart = campaignsPerPage * (currentPage - 1);
      const indexEnd = indexStart + campaignsPerPage;
      pagesSubArray = campaignDeliveryItems.slice(indexStart, indexEnd);
    } else {
      pagesSubArray = campaignDeliveryItems;
    }

    const campaignDeliveryCollection = {
      items: pagesSubArray,
      currentPage: currentPage,
      itemsCount: campaignDeliveryItems.length,
      pagesCount: Math.floor(campaignDeliveryItems.length / campaignsPerPage),
    };

    return {
      success: true,
      value: campaignDeliveryCollection,
    };

    // return {
    //   success: false,
    //   error: new Error('Dummy error'),
    // };
  }

  public async getSubscribers(
    searchText: string,
  ): Promise<ResultWithoutExpectedErrors<SubscriberCollection>> {
    console.log('getSubscribers');
    await timeout(1500);

    return {
      success: true,
      value: subscriberCollection,
    };

    // return {
    //   success: false,
    //   error: new Error('Dummy error'),
    // };
  }
}
