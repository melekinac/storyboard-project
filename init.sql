
CREATE TABLE people (
  people_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  people_nickname VARCHAR(255),
  people_email VARCHAR(255),
  people_created_date_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  people_password VARCHAR(255)
);

CREATE TABLE storyboard (
  storyboard_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storyboard_title VARCHAR(255),
  storyboard_text TEXT,
  storyboard_created_date_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  people_id UUID NOT NULL,
  storyboard_media_url TEXT,
  
  FOREIGN KEY (people_id) REFERENCES people(people_id)
);

CREATE TABLE storyboard_frame (
  storyboard_frame_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storyboard_id UUID NOT NULL,
  storyboard_frame_media_url TEXT,
  storyboard_frame_created_date_time TIMESTAMP WITH TIME ZONE DEFAULT now(),

  FOREIGN KEY (storyboard_id) REFERENCES storyboard(storyboard_id) ON DELETE CASCADE
);

CREATE TABLE category (
  category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_name VARCHAR(255) UNIQUE NOT NULL,
  category_description TEXT,
  category_type VARCHAR(255),
  category_created_date_time TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE category_objects (
  category_objects_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storyboard_id UUID NOT NULL,
  category_id UUID NOT NULL,
  category_objects_created_date_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  FOREIGN KEY (storyboard_id) REFERENCES storyboard(storyboard_id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE
);
