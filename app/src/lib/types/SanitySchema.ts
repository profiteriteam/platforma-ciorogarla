import type {
  SanityReference,
  SanityKeyedReference,
  SanityAsset,
  SanityImage,
  SanityFile,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
  SanityImageAsset,
  SanityImageMetadata,
  SanityImageDimensions,
  SanityImagePalette,
  SanityImagePaletteSwatch,
} from "sanity-codegen";

export type {
  SanityReference,
  SanityKeyedReference,
  SanityAsset,
  SanityImage,
  SanityFile,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
  SanityImageAsset,
  SanityImageMetadata,
  SanityImageDimensions,
  SanityImagePalette,
  SanityImagePaletteSwatch,
};

/**
 * Business
 *
 *
 */
export interface Business extends SanityDocument {
  _type: "business";

  /**
   * Name — `string`
   *
   * The name of the business
   */
  name?: string;

  /**
   * Description — `text`
   *
   * A description of the business
   */
  description?: string;

  /**
   * Type — `string`
   *
   * The type of business
   */
  type?:
    | "restaurant"
    | "cafe"
    | "pub"
    | "barbershop"
    | "itp"
    | "showroom"
    | "distributor"
    | "autoParts"
    | "market"
    | "pizza"
    | "hotel"
    | "cakeShop";

  /**
   * Slug — `slug`
   *
   * The slug of the business
   */
  slug?: { _type: "slug"; current: string };

  /**
   * Logo — `image`
   *
   * The logo of the business
   */
  logo?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * Cover — `image`
   *
   * The cover image of the business
   */
  cover?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * Photos — `array`
   *
   * The photos of the business
   */
  photos?: Array<
    SanityKeyed<{
      _type: "photo";
      asset: SanityReference<SanityImageAsset>;
      crop?: SanityImageCrop;
      hotspot?: SanityImageHotspot;
    }>
  >;

  /**
   * Prices — `string`
   *
   * The price range of the business
   */
  prices?: "$" | "$$" | "$$$" | "$$$$";

  /**
   * Prices link — `url`
   *
   * The link to the prices page
   */
  pricesLink?: string;

  /**
   * Is sponsor — `boolean`
   *
   * Is the business a sponsor of Ciorogarla Unita
   */
  isSponsor?: boolean;

  /**
   * Location — `object`
   *
   * The location
   */
  location?: {
    _type: "location";
    /**
     * Address — `string`
     *
     * A human readable address
     */
    address?: string;

    /**
     * Plus code — `string`
     *
     * The plus code of location
     */
    plus?: string;

    /**
     * Street View location — `string`
     *
     * Location Street View
     */
    locationStreetview?: string;
  };

  /**
   * Contact — `object`
   *
   * The contact information
   */
  contact?: {
    _type: "contact";
    /**
     * Phone — `string`
     *
     * The phone number
     */
    phone?: string;

    /**
     * Email — `string`
     *
     * The email address
     */
    email?: string;

    /**
     * Website — `url`
     *
     * The website
     */
    website?: string;

    /**
     * Facebook — `url`
     *
     * The Facebook page
     */
    facebook?: string;

    /**
     * Instagram — `url`
     *
     * The Instagram page
     */
    instagram?: string;
  };
}

/**
 * Article
 *
 *
 */
export interface Article extends SanityDocument {
  _type: "article";

  /**
   * Title — `string`
   *
   * The title of the news article
   */
  title?: string;

  /**
   * Slug — `slug`
   *
   * The slug of the news article
   */
  slug?: { _type: "slug"; current: string };

  /**
   * Tags — `array`
   *
   * The tags of the news article
   */
  tags?: Array<SanityKeyed<string>>;

  /**
   * Cover — `image`
   *
   * The cover of the news article
   */
  cover?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * Urgent — `boolean`
   *
   * Is this news article urgent?
   */
  urgent?: boolean;

  /**
   * Content — `markdown`
   *
   * The content of the news article
   */
  content?: Markdown;
}

/**
 * Country
 *
 *
 */
export interface Country extends SanityDocument {
  _type: "country";

  /**
   * Name — `string`
   *
   * The name of the country
   */
  name?: string;
}

/**
 * Organisation
 *
 *
 */
export interface Organisation extends SanityDocument {
  _type: "organisation";

  /**
   * Name — `string`
   *
   * The name of the organisation
   */
  name?: string;

  /**
   * Logo — `image`
   *
   * The logo of the organisation
   */
  logo?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * Contact — `object`
   *
   * The contact information
   */
  contact?: {
    _type: "contact";
    /**
     * Phone — `string`
     *
     * The phone number
     */
    phone?: string;

    /**
     * Email — `string`
     *
     * The email address
     */
    email?: string;

    /**
     * Website — `url`
     *
     * The website
     */
    website?: string;

    /**
     * Facebook — `url`
     *
     * The Facebook page
     */
    facebook?: string;

    /**
     * Instagram — `url`
     *
     * The Instagram page
     */
    instagram?: string;
  };
}

/**
 * Knowledge
 *
 * Knowledge base for smart search
 */
export interface Knowledge extends SanityDocument {
  _type: "knowledge";

  /**
   * Title — `string`
   *
   * The title of the knowledge
   */
  title?: string;

  /**
   * Content — `markdown`
   *
   * The content of the knowledge
   */
  content?: Markdown;
}

export type Documents = Business | Article | Country | Organisation | Knowledge;

/**
 * This interface is a stub. It was referenced in your sanity schema but
 * the definition was not actually found. Future versions of
 * sanity-codegen will let you type this explicity.
 */
type Markdown = any;
