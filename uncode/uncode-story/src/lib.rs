extern crate serde_json;

use gherkin_rust::{Feature};
use uncode_core::StoryModel;
use walkdir::{WalkDir, DirEntry};
use std::fs;

pub fn parse(content: &str) -> StoryModel {
  let mut story = StoryModel::default();
  let result = Feature::parse(content, Default::default());
  match result {
    Ok(feature) => {
      story.title = feature.name;
      story.description = feature.description.unwrap_or("".to_string());
    }
    Err(err) => {
      println!("error: {:?}", err);
    }
  }

  story
}

pub fn parse_dir(path: String) -> Vec<StoryModel> {
  fn is_story(entry: &DirEntry) -> bool {
    if entry.file_type().is_dir() {
      return true;
    }

    entry.file_name()
      .to_str()
      .map(|s| s.ends_with(".feature"))
      .unwrap_or(false)
  }

  let walker = WalkDir::new(path).into_iter();
  let mut stories = vec![];
  for entry in walker.filter_entry(|e| is_story(e)) {
    if let Ok(dir) = entry {
      if dir.file_type().is_file() {
        let content = fs::read_to_string(dir.path()).expect("error to load file");
        stories.push(parse(&*content));
      }
    }
  };

  stories
}

#[cfg(test)]
mod tests {
  use std::path::PathBuf;
  use crate::parse_dir;

  #[test]
  fn should_parse_demo_project_story() {
    let d = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    let path = format!("{}", d.join("story").display());
    let stories = parse_dir(path);

    assert_eq!(1, stories.len());
    assert_eq!("第一个用户故事", stories[0].title);
  }
}
