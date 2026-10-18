#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Channel {
    Stable,
    Beta,
    Nightly,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ChannelError {
    pub code: &'static str,
    pub channel: String,
}

pub fn parse_channel(value: &str) -> Result<Channel, ChannelError> {
    match value {
        "stable" => Ok(Channel::Stable),
        "beta" => Ok(Channel::Beta),
        "nightly" => Ok(Channel::Nightly),
        other => Err(ChannelError {
            code: "invalid_channel",
            channel: other.to_string(),
        }),
    }
}

#[cfg(test)]
mod updater_tests {
    use super::{parse_channel, Channel};

    #[test]
    fn updater_accepts_stable_beta_and_nightly() {
        assert_eq!(parse_channel("stable").unwrap(), Channel::Stable);
        assert_eq!(parse_channel("beta").unwrap(), Channel::Beta);
        assert_eq!(parse_channel("nightly").unwrap(), Channel::Nightly);
    }

    #[test]
    fn updater_rejects_an_invalid_channel() {
        let error = parse_channel("canary").unwrap_err();
        assert_eq!(error.code, "invalid_channel");
        assert_eq!(error.channel, "canary");
    }
}
